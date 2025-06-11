import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch service analytics (revenue, booking counts, staff)
export async function GET() {
  try {
    // Fetch all services
    const services = await prisma.service.findMany({
      include: {
        variables: true
      }
    });

    // Fetch all booking services with related data
    const bookingServices = await prisma.bookingService.findMany({
      include: {
        booking: true,
        service: true
      }
    });

    // Fetch all staff with their services
    const staff = await prisma.staff.findMany();

    // Calculate analytics for each service
    const serviceAnalytics = services.map(service => {
      // Calculate revenue for this service
      const serviceBookings = bookingServices.filter(bs => bs.serviceId === service.id);
      const revenue = serviceBookings.reduce((total, booking) => {
        return total + (booking.quantity * booking.unitPrice);
      }, 0);

      // Count number of bookings for this service
      const numberOfBookings = serviceBookings.length;

      // Find staff who render this service
      const serviceStaff = staff.filter(staffMember => {
        if (!staffMember.servicesRendered) return false;
        
        // Parse servicesRendered (assuming it's stored as JSON string or array)
        let renderedServices;
        try {
          renderedServices = typeof staffMember.servicesRendered === 'string' 
            ? JSON.parse(staffMember.servicesRendered)
            : staffMember.servicesRendered;
        } catch {
          renderedServices = [];
        }

        // Check if this service is in the staff's rendered services
        // servicesRendered contains service names
        return Array.isArray(renderedServices) && 
               renderedServices.includes(service.name);
      });

      const staffNames = serviceStaff.map(s => `${s.firstName} ${s.lastName}`);

      return {
        id: service.id,
        name: service.name,
        icon: service.icon,
        description: service.description,
        variables: service.variables,
        revenueGenerated: revenue,
        numberOfBookings: numberOfBookings,
        staff: staffNames.join(', ') || 'No staff assigned'
      };
    });

    return NextResponse.json(serviceAnalytics);
  } catch (error) {
    console.error('Error fetching service analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}