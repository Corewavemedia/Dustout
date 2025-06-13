import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const prisma = new PrismaClient();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Extract booking data from client_reference_id and metadata
        const userId = session.metadata?.userId;
        const clientReferenceId = session.client_reference_id;
        
        if (!userId || !clientReferenceId) {
          console.error('Missing userId or client_reference_id in session');
          return NextResponse.json({ error: 'Missing required session data' }, { status: 400 });
        }

        // Extract booking reference ID from client_reference_id
        const bookingReferenceId = session.client_reference_id!;
        
        // Retrieve booking data from temporary storage
        const tempBookingData = await prisma.tempBookingData.findUnique({
          where: { referenceId: bookingReferenceId }
        });
        
        if (!tempBookingData) {
          console.error('Booking data not found for reference ID:', bookingReferenceId);
          return NextResponse.json({ error: 'Booking data not found' }, { status: 400 });
        }
        
        const bookingData = JSON.parse(tempBookingData.bookingData);

        console.log('Creating booking for user:', userId);
        console.log('Booking data:', JSON.stringify(bookingData, null, 2));
        
        // Create booking in database
        let booking;
        try {
          booking = await prisma.$transaction(async (tx) => {
          console.log('Starting transaction for booking creation');
          // Create the main booking
          const newBooking = await tx.booking.create({
            data: {
              userId: userId,
              fullName: bookingData.fullName,
              email: bookingData.email,
              phone: bookingData.phone,
              address: bookingData.address,
              city: bookingData.city,
              postcode: bookingData.postcode,
              frequency: bookingData.frequency,
              preferredDate: new Date(bookingData.preferredDate),
              preferredTime: bookingData.preferredTime,
              estimatedPrice: bookingData.estimatedPrice,
              specialInstructions: bookingData.specialInstructions || '',
              status: 'confirmed',
              paymentStatus: 'paid',
              stripeSessionId: session.id,
              paymentIntentId: session.payment_intent as string,
            },
          });

          console.log('Booking created with ID:', newBooking.id);
          
          // Create booking services
          console.log('Creating booking services for', bookingData.selectedServices?.length || 0, 'services');
          for (const selectedService of bookingData.selectedServices || []) {
            console.log('Processing service:', selectedService.serviceId);
            for (const variable of selectedService.variables || []) {
              console.log('Processing variable:', variable.variableId, 'with quantity:', variable.quantity);
              
              // Get the service and variable data
              const service = await tx.service.findUnique({
                where: { id: selectedService.serviceId },
              });
              
              const serviceVariable = await tx.serviceVariable.findUnique({
                where: { id: variable.variableId },
              });

              if (service && serviceVariable) {
                console.log('Creating booking service for:', service.name, 'variable:', serviceVariable.name);
                await tx.bookingService.create({
                  data: {
                    bookingId: newBooking.id,
                    serviceId: selectedService.serviceId,
                    serviceName: service.name,
                    variableId: variable.variableId,
                    variableName: serviceVariable.name,
                    variableValue: `${variable.quantity} x ${serviceVariable.name}`,
                    price: serviceVariable.unitPrice * variable.quantity,
                  },
                });
              } else {
                console.error('Service or variable not found:', selectedService.serviceId, variable.variableId);
              }
            }
          }
          
          console.log('Transaction completed successfully');
           return newBooking;
         });
        } catch (transactionError) {
          console.error('Transaction failed:', transactionError);
          throw transactionError;
        }

        // Send confirmation emails
        try {
          await sendBookingConfirmationEmail({
            to: bookingData.email,
            customerName: bookingData.fullName,
            bookingId: booking.id,
            services: bookingData.selectedServices,
            preferredDate: bookingData.preferredDate,
            preferredTime: bookingData.preferredTime,
            totalAmount: bookingData.estimatedPrice,
            address: `${bookingData.address}, ${bookingData.city}, ${bookingData.postcode}`,
          });

          await sendAdminNotificationEmail({
            customerName: bookingData.fullName,
            customerEmail: bookingData.email,
            customerPhone: bookingData.phone,
            bookingId: booking.id,
            services: bookingData.selectedServices,
            preferredDate: bookingData.preferredDate,
            preferredTime: bookingData.preferredTime,
            totalAmount: bookingData.estimatedPrice,
            address: `${bookingData.address}, ${bookingData.city}, ${bookingData.postcode}`,
            specialInstructions: bookingData.specialInstructions,
          });
          
          // Clean up temporary booking data
          await prisma.tempBookingData.delete({
            where: { referenceId: bookingReferenceId }
          });
        } catch (emailError) {
          console.error('Error sending emails:', emailError);
          // Don't fail the webhook if email fails
        }

        console.log('Booking created successfully:', booking.id);
      } catch (error) {
        console.error('Error processing successful payment:', error);
        return NextResponse.json({ error: 'Error processing payment' }, { status: 500 });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}