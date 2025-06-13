import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all clients (from bookings table)
export async function GET() {
  try {

    // Get all bookings with related services for admin view
    const bookings = await prisma.booking.findMany({
      include: {
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform bookings data to match client list interface
    const clients = bookings.map(booking => {
      // Get services ordered as a comma-separated string
      const servicesOrdered = booking.services
        .map(bs => bs.service.name)
        .join(', ');

      // Format date and time
      const dateTime = booking.preferredDate && booking.preferredTime
          ? `${new Date(booking.preferredDate).toLocaleDateString()} ${booking.preferredTime}`
        : booking.createdAt.toLocaleDateString();

      // Format revenue from estimated price
      const revenue = booking.estimatedPrice 
        ? `$${booking.estimatedPrice.toFixed(2)}`
        : '£0.00';

      return {
        id: booking.id,
        clientName: booking.fullName,
        dateAndTime: dateTime,
        servicesOrdered: servicesOrdered,
        address: booking.address,
        revenue: revenue,
        email: booking.email,
        phoneNumber: booking.phone,
        specialInstructions: booking.specialInstructions || ''
      };
    });

    return NextResponse.json({ clients }, { status: 200 });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update client details
export async function PUT(request: NextRequest) {
  try {

    // Parse the request body
    const clientData = await request.json();
    
    const {
      id,
      clientName,
      email,
      phoneNumber,
      address,
      specialInstructions,
      revenue
    } = clientData;

    // Validate required fields
    if (!id || !clientName || !email || !phoneNumber || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse revenue to get estimated price
    const estimatedPrice = revenue ? parseFloat(revenue.replace(/[£$,]/g, '')) : null;

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        fullName: clientName,
        email,
        phone: phoneNumber,
        address: address,
        specialInstructions: specialInstructions || null,
        estimatedPrice: estimatedPrice,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { 
        message: 'Client updated successfully',
        client: updatedBooking
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete client
export async function DELETE(request: NextRequest) {
  try {

    // Get client ID from URL search params
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('id');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Delete the booking (this will cascade delete related booking services)
    await prisma.booking.delete({
      where: { id: clientId }
    });

    return NextResponse.json(
      { message: 'Client deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}