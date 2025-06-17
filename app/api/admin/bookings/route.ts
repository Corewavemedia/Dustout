import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendBookingConfirmationEmail, sendSchedulingConfirmationEmail } from '@/lib/email';

const prisma = new PrismaClient();

// GET - Fetch all bookings for admin dashboard
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true
          }
        },
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        services: {
          include: {
            service: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the data for the frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      clientName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      dateAndTime: booking.preferredDate && booking.preferredTime 
        ? `${booking.preferredDate.toISOString().split('T')[0]}, ${booking.preferredTime}`
        : 'Not specified',
      service: booking.services.map(bs => bs.service.name).join(', ') || 'No services',
      staff: booking.staff 
        ? `${booking.staff.firstName} ${booking.staff.lastName}` 
        : 'Not assigned',
      amount: booking.estimatedPrice ? `$${booking.estimatedPrice.toFixed(2)}` : 'Not calculated',
      status: booking.status,
      address: booking.address,
      createdAt: booking.createdAt
    }));
    
    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create new booking by admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      staffAssigned,
      date,
      startingTime,
      endingTime,
      services,
      specialNote
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !date || !startingTime || !endingTime || !services) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          username: email,
          email,
          fullname: `${firstName} ${lastName}`,
          phone,
          is_verified: true
        }
      });
    }

    // Find staff by name if assigned
    let staffId = null;
    if (staffAssigned) {
      const staff = await prisma.staff.findFirst({
        where: {
          OR: [
            { firstName: { contains: staffAssigned, mode: 'insensitive' } },
            { lastName: { contains: staffAssigned, mode: 'insensitive' } },
            {
              AND: [
                { firstName: { contains: staffAssigned.split(' ')[0], mode: 'insensitive' } },
                { lastName: { contains: staffAssigned.split(' ')[1] || '', mode: 'insensitive' } }
              ]
            }
          ]
        }
      });
      
      if (staff) {
        staffId = staff.id;
      }
    }

    // Find service by name
    const service = await prisma.service.findFirst({
      where: {
        name: { contains: services, mode: 'insensitive' }
      },
      include: {
        variables: true
      }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 400 }
      );
    }

    // Calculate estimated price (using first variable's price as base)
    const estimatedPrice = service.variables.length > 0 ? service.variables[0].unitPrice : 0;

    // Create booking with services in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create the main booking
      const newBooking = await tx.booking.create({
        data: {
          userId: user.id,
          fullName: `${firstName} ${lastName}`,
          phone,
          email,
          address: 'To be specified', // Default value since not in form
          frequency: 'One-time', // Default value
          preferredDate: date,
          preferredTime: `${startingTime} - ${endingTime}`,
          specialInstructions: specialNote || null,
          estimatedPrice,
          staffId,
          status: 'scheduled'
        },
      });

      // Create booking service
      if (service.variables.length > 0) {
        const variable = service.variables[0];
        await tx.bookingService.create({
          data: {
            bookingId: newBooking.id,
            serviceId: service.id,
            serviceName: service.name,
            variableId: variable.id,
            variableName: variable.name,
            variableValue: `1 x ${variable.name}`,
            price: variable.unitPrice
          }
        });
      }

      return newBooking;
    });

    // Send booking confirmation email to customer
    try {
      // Prepare services data for email
      const servicesForEmail = [{
        serviceName: service.name,
        selectedVariables: service.variables.length > 0 ? [{
          variableName: service.variables[0].name,
          variableValue: `1 x ${service.variables[0].name}`,
        }] : [],
      }];

      console.log('Attempting to send booking confirmation email to:', email);
      const emailResult = await sendBookingConfirmationEmail({
        to: email,
        customerName: `${firstName} ${lastName}`,
        bookingId: booking.id,
        services: servicesForEmail,
        preferredDate: date,
        preferredTime: `${startingTime} - ${endingTime}`,
        totalAmount: estimatedPrice,
        address: 'To be specified', // Default value since not in form
      });
      console.log('Booking confirmation email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Error sending booking confirmation email:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
      // Don't fail the API call if email fails
    }

    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        bookingId: booking.id,
        estimatedPrice: booking.estimatedPrice
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update existing booking (mainly for staff assignment)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, staffAssigned } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find staff by name if assigned
    let staffId = null;
    if (staffAssigned) {
      const staff = await prisma.staff.findFirst({
        where: {
          OR: [
            { firstName: { contains: staffAssigned, mode: 'insensitive' } },
            { lastName: { contains: staffAssigned, mode: 'insensitive' } },
            {
              AND: [
                { firstName: { contains: staffAssigned.split(' ')[0], mode: 'insensitive' } },
                { lastName: { contains: staffAssigned.split(' ')[1] || '', mode: 'insensitive' } }
              ]
            }
          ]
        }
      });
      
      if (staff) {
        staffId = staff.id;
      } else {
        return NextResponse.json(
          { error: 'Staff member not found' },
          { status: 400 }
        );
      }
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        staffId,
        status: staffId ? 'confirmed' : 'scheduled'
      },
      include: {
        staff: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        },
        services: {
          include: {
            service: true,
          },
        },
        user: {
          select: {
            email: true,
            fullname: true
          }
        }
      }
    });

    // Send scheduling confirmation email if staff is assigned
    if (staffId && updatedBooking.staff) {
      try {
        // Get the booking details for the email
        const bookingDetails = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: {
            services: {
              include: {
                service: true,
              },
            },
          },
        });

        if (bookingDetails) {
          // Prepare services data for email
          const servicesForEmail = bookingDetails.services.map(bs => ({
            serviceName: bs.serviceName,
            selectedVariables: [{
              variableName: bs.variableName,
              variableValue: bs.variableValue,
            }],
          }));

          // Extract date and time from preferredDate and preferredTime
          const scheduledDate = bookingDetails.preferredDate ? bookingDetails.preferredDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          const scheduledTime = bookingDetails.preferredTime || 'TBD';
          const customerName = updatedBooking.user.fullname || 'Customer';
          const customerEmail = updatedBooking.user.email;
          
          // Only send email if we have a valid email address
          if (customerEmail) {
            console.log('Attempting to send scheduling confirmation email to:', customerEmail);
            const emailResult = await sendSchedulingConfirmationEmail({
              to: customerEmail,
              customerName: customerName,
              bookingId: bookingId,
              scheduledDate: scheduledDate,
              scheduledTime: scheduledTime,
              assignedStaff: `${updatedBooking.staff.firstName} ${updatedBooking.staff.lastName}`,
              services: servicesForEmail,
              address: `${bookingDetails.address || 'To be specified'}`,
            });
            console.log('Scheduling confirmation email sent successfully:', emailResult);
          } else {
             console.log('No email address available for customer, skipping email notification');
           }
        }
      } catch (emailError) {
        console.error('Error sending scheduling confirmation email:', emailError);
        console.error('Email error details:', JSON.stringify(emailError, null, 2));
        // Don't fail the API call if email fails
      }
    }

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
      staffAssigned: updatedBooking.staff 
        ? `${updatedBooking.staff.firstName} ${updatedBooking.staff.lastName}`
        : null
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}