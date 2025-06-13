# Stripe and Email Integration Setup Guide

This guide explains how to set up the complete Stripe payment and email functionality for the DustOut booking system.

## Overview

The implementation includes:
- Stripe checkout integration for payments
- Webhook handling for successful payments
- Email notifications (booking confirmation and admin alerts)
- Payment status handling with success/failure redirects
- Booking scheduling with email confirmations

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

#### Stripe Configuration (Test Mode)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your test API keys:
   - `STRIPE_SECRET_KEY`: Your secret key (starts with `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your publishable key (starts with `pk_test_`)

#### Webhook Configuration
1. In Stripe Dashboard, go to Developers > Webhooks
2. Create a new webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

#### Email Configuration (cPanel)
Configure your cPanel email settings:
```env
EMAIL_HOST="mail.yourdomain.com"  # Your cPanel mail server
EMAIL_PORT="587"                  # Usually 587 for TLS
EMAIL_SECURE="false"              # false for TLS, true for SSL
EMAIL_USER="noreply@yourdomain.com"
EMAIL_PASS="your_email_password"
EMAIL_FROM="noreply@yourdomain.com"
ADMIN_EMAIL="admin@yourdomain.com"
```

### 2. Database Migration

Run the database migration to update the schema:

```bash
npm run db:push
```

### 3. Testing the Integration

#### Test Payment Flow
1. Fill out the booking form
2. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

#### Test Email Functionality
1. Complete a test booking
2. Check that confirmation emails are sent
3. Verify admin notification emails

### 4. Workflow Implementation

The complete workflow is now implemented:

1. **User enters booking details** ✅
   - Booking form captures all required information

2. **Estimate price calculation** ✅
   - Price calculated in step 3 of booking form

3. **Submit booking form** ✅
   - Redirects to Stripe checkout instead of direct submission

4. **User completes payment on Stripe** ✅
   - Stripe handles secure payment processing

5. **Stripe redirects user back** ✅
   - Success/failure messages shown on return

6. **Store booking details in database** ✅
   - Webhook stores booking after successful payment

7. **Send confirmation emails** ✅
   - Customer gets booking confirmation
   - Admin gets new booking alert

8. **Admin schedules the booking** ✅
   - Use `/api/bookings/schedule` endpoint
   - Assign staff and set schedule

9. **Send scheduling confirmation email** ✅
   - Customer notified when booking is scheduled

## API Endpoints

### Payment Processing
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/webhook` - Handle payment webhooks

### Booking Management
- `PUT /api/bookings/schedule` - Schedule a booking

## File Structure

```
app/
├── api/
│   ├── stripe/
│   │   ├── create-checkout-session/route.ts
│   │   └── webhook/route.ts
│   └── bookings/
│       └── schedule/route.ts
components/
└── PaymentStatus.tsx
lib/
└── email.ts
prisma/
└── schema.prisma (updated)
```

## Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Webhook Security**: Always verify webhook signatures
3. **API Authentication**: All endpoints require valid Supabase tokens
4. **Email Security**: Use app-specific passwords for email accounts

## Upgrading to Live Mode

When ready for production:

1. Replace test Stripe keys with live keys
2. Update webhook endpoint to production URL
3. Test thoroughly with small amounts
4. Monitor Stripe dashboard for any issues

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Check Stripe dashboard for delivery attempts

2. **Email not sending**
   - Verify cPanel email credentials
   - Check email server settings
   - Test with a simple email client first

3. **Payment not processing**
   - Check Stripe API keys are correct
   - Verify test mode vs live mode settings
   - Check browser console for errors

### Logs

Check the following for debugging:
- Browser console for frontend errors
- Server logs for API errors
- Stripe dashboard for payment events
- Email server logs for delivery issues

## Support

For issues with:
- **Stripe**: Check [Stripe Documentation](https://stripe.com/docs)
- **Email**: Contact your hosting provider for cPanel email support
- **Database**: Check Prisma documentation for schema issues