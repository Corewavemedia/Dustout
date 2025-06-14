import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface ServiceVariable {
  variableName: string;
  variableValue: string;
}

interface Service {
  serviceName: string;
  selectedVariables: ServiceVariable[];
}

interface BookingConfirmationData {
  to: string;
  customerName: string;
  bookingId: string;
  services: Service[];
  preferredDate: string;
  preferredTime: string;
  totalAmount: number;
  address: string;
}

interface AdminNotificationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingId: string;
  services: Service[];
  preferredDate: string;
  preferredTime: string;
  totalAmount: number;
  address: string;
  specialInstructions?: string;
}

interface SchedulingConfirmationData {
  to: string;
  customerName: string;
  bookingId: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedStaff: string;
  services: Service[];
  address: string;
}

export interface SubscriptionUpgradeData {
  to: string;
  customerName: string;
  subscriptionId: string;
  oldPlanName: string;
  newPlanName: string;
  newPrice: number;
  isUpgrade: boolean;
  effectiveDate: string;
  nextBillingDate: string;
  features: string[];
}

export interface SubscriptionConfirmationData {
  to: string;
  customerName: string;
  subscriptionId: string;
  planName: string;
  planType: 'residential' | 'industrial';
  price: number;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string;
  features: string[];
}

export interface SubscriptionCancellationData {
  to: string;
  customerName: string;
  subscriptionId: string;
  planName: string;
  cancellationDate: string;
  endDate: string;
  refundAmount?: number;
}

export interface SubscriptionAdminNotificationData {
  customerName: string;
  customerEmail: string;
  subscriptionId: string;
  planName: string;
  price: number;
  action: 'created' | 'cancelled' | 'updated';
  actionDate: string;
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  const servicesList = data.services
    .map(service => {
      const variables = service.selectedVariables
        .map((v: ServiceVariable) => `${v.variableName}: ${v.variableValue}`)
        .join(', ');
      return `${service.serviceName} (${variables})`;
    })
    .join('\n');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - DustOut</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .highlight { color: #2563eb; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear <span class="highlight">${data.customerName}</span>,</p>
          <p>Thank you for choosing DustOut! Your booking has been confirmed and payment has been processed successfully.</p>
          
          <div class="booking-details">
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            <p><strong>Date:</strong> ${new Date(data.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${data.preferredTime}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Total Amount:</strong> £${data.totalAmount.toFixed(2)}</p>
            
            <h4>Services:</h4>
            <pre>${servicesList}</pre>
          </div>
          
          <p>Our team will contact you shortly to confirm the final details and schedule your cleaning service.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing DustOut!</p>
          <p>Best regards,<br>The DustOut Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.to,
      subject: `Booking Confirmation - ${data.bookingId}`,
      html: htmlContent,
    });
    console.log('Booking confirmation email sent successfully:', result.data?.id || 'Email sent');
    return result;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
}

export async function sendAdminNotificationEmail(data: AdminNotificationData) {
  const servicesList = data.services
    .map(service => {
      const variables = service.selectedVariables
        .map((v: ServiceVariable) => `${v.variableName}: ${v.variableValue}`)
        .join(', ');
      return `${service.serviceName} (${variables})`;
    })
    .join('\n');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Alert - DustOut Admin</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .customer-info { background-color: #e0f2fe; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .highlight { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Booking Alert</h1>
        </div>
        <div class="content">
          <p>A new booking has been confirmed and paid for!</p>
          
          <div class="customer-info">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Phone:</strong> ${data.customerPhone}</p>
          </div>
          
          <div class="booking-details">
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> <span class="highlight">${data.bookingId}</span></p>
            <p><strong>Date:</strong> ${new Date(data.preferredDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${data.preferredTime}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Total Amount:</strong> £${data.totalAmount.toFixed(2)}</p>
            
            <h4>Services:</h4>
            <pre>${servicesList}</pre>
            
            ${data.specialInstructions ? `
            <h4>Special Instructions:</h4>
            <p>${data.specialInstructions}</p>
            ` : ''}
          </div>
          
          <p><strong>Action Required:</strong> Please log into the admin dashboard to assign staff and schedule this booking.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'admin@dustout.co.uk',
      subject: `🚨 New Booking Alert - ${data.bookingId}`,
      html: htmlContent,
    });
    console.log('Admin notification email sent successfully:', result.data?.id || 'Email sent');
    return result;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
}

export async function sendSchedulingConfirmationEmail(data: SchedulingConfirmationData) {
  const servicesList = data.services
    .map(service => {
      const variables = service.selectedVariables
        .map((v: ServiceVariable) => `${v.variableName}: ${v.variableValue}`)
        .join(', ');
      return `${service.serviceName} (${variables})`;
    })
    .join('\n');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Scheduled - DustOut</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .highlight { color: #16a34a; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Scheduled</h1>
        </div>
        <div class="content">
          <p>Dear <span class="highlight">${data.customerName}</span>,</p>
          <p>Great news! Your booking has been scheduled and our team is ready to provide you with excellent service.</p>
          
          <div class="booking-details">
            <h3>Scheduled Details:</h3>
            <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            <p><strong>Scheduled Date:</strong> <span class="highlight">${new Date(data.scheduledDate).toLocaleDateString()}</span></p>
            <p><strong>Scheduled Time:</strong> <span class="highlight">${data.scheduledTime}</span></p>
            <p><strong>Assigned Staff:</strong> ${data.assignedStaff}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            
            <h4>Services:</h4>
            <pre>${servicesList}</pre>
          </div>
          
          <p>Our team will arrive at the scheduled time. Please ensure someone is available to provide access to the property.</p>
          <p>If you need to make any changes or have questions, please contact us as soon as possible.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing DustOut!</p>
          <p>Best regards,<br>The DustOut Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.to,
      subject: `Booking Scheduled - ${data.bookingId}`,
      html: htmlContent,
    });
    console.log('Scheduling confirmation email sent successfully:', result.data?.id || 'Email sent');
    return result;
  } catch (error) {
      console.error('Error sending scheduling confirmation email:', error);
      throw error;
    }
  }

export async function sendSubscriptionConfirmationEmail(data: SubscriptionConfirmationData) {
  const featuresList = data.features
    .map(feature => `<li style="margin-bottom: 8px; color: #374151;">${feature}</li>`)
    .join('');

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.to,
      subject: `Welcome to ${data.planName} - Subscription Confirmed`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DustOut</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Professional Cleaning Services</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1a202c; margin-bottom: 20px;">🎉 Welcome to ${data.planName}!</h2>
            
            <p style="margin-bottom: 20px;">Dear ${data.customerName},</p>
            
            <p style="margin-bottom: 20px;">Thank you for subscribing to DustOut! Your subscription has been confirmed and is now active.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1a202c;">Subscription Details</h3>
              <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
              <p><strong>Plan:</strong> ${data.planName}</p>
              <p><strong>Price:</strong> £${data.price.toFixed(2)}/${data.billingCycle}</p>
              <p><strong>Start Date:</strong> ${new Date(data.startDate).toLocaleDateString('en-GB')}</p>
              <p><strong>Next Billing Date:</strong> ${new Date(data.nextBillingDate).toLocaleDateString('en-GB')}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1a202c;">Your Plan Includes</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${featuresList}
              </ul>
            </div>
            
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;"><strong>🚀 Get Started:</strong> Log into your dashboard to schedule your first cleaning or manage your subscription.</p>
            </div>
            
            <p style="margin: 20px 0;">Our team will contact you shortly to discuss your cleaning preferences and schedule your services.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Dashboard</a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
              <p>Thank you for choosing DustOut!</p>
              <p>Email: info@dustout.co.uk | Phone: +44 20 1234 5678</p>
              <p>Visit us: <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #667eea;">www.dustout.co.uk</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Subscription confirmation email sent successfully:', result.data?.id || 'Email sent');
    return result;
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
    throw error;
  }
}

export async function sendSubscriptionCancellationEmail(data: SubscriptionCancellationData) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.to,
      subject: `Subscription Cancelled - ${data.planName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription Cancellation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DustOut</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Professional Cleaning Services</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1a202c; margin-bottom: 20px;">Subscription Cancelled</h2>
            
            <p style="margin-bottom: 20px;">Dear ${data.customerName},</p>
            
            <p style="margin-bottom: 20px;">We're sorry to see you go. Your subscription has been cancelled as requested.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1a202c;">Cancellation Details</h3>
              <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
              <p><strong>Plan:</strong> ${data.planName}</p>
              <p><strong>Cancellation Date:</strong> ${new Date(data.cancellationDate).toLocaleDateString('en-GB')}</p>
              <p><strong>Service End Date:</strong> ${new Date(data.endDate).toLocaleDateString('en-GB')}</p>
              ${data.refundAmount ? `<p><strong>Refund Amount:</strong> £${data.refundAmount.toFixed(2)}</p>` : ''}
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border: 1px solid #f59e0b; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> You will continue to have access to your services until ${new Date(data.endDate).toLocaleDateString('en-GB')}.</p>
            </div>
            
            <p style="margin: 20px 0;">We'd love to have you back anytime. If you change your mind or have any feedback about your experience, please don't hesitate to contact us.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Resubscribe</a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
              <p>Thank you for being part of DustOut!</p>
              <p>Email: info@dustout.co.uk | Phone: +44 20 1234 5678</p>
              <p>Visit us: <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #667eea;">www.dustout.co.uk</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Subscription cancellation email sent successfully:', result.data?.id || 'Email sent');
    return result;
  } catch (error) {
    console.error('Error sending subscription cancellation email:', error);
    throw error;
  }
}

export async function sendSubscriptionAdminNotificationEmail(data: SubscriptionAdminNotificationData) {
  const actionColors = {
    created: '#10B981',
    cancelled: '#ef4444',
    updated: '#f59e0b'
  };
  
  const actionEmojis = {
    created: '🎉',
    cancelled: '❌',
    updated: '🔄'
  };

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'admin@dustout.co.uk',
      subject: `${actionEmojis[data.action]} Subscription ${data.action.charAt(0).toUpperCase() + data.action.slice(1)} - ${data.subscriptionId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Subscription ${data.action.charAt(0).toUpperCase() + data.action.slice(1)} Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: ${actionColors[data.action]}; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .customer-info { background-color: #e0f2fe; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .highlight { color: ${actionColors[data.action]}; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${actionEmojis[data.action]} Subscription ${data.action.charAt(0).toUpperCase() + data.action.slice(1)} Alert</h1>
            </div>
            <div class="content">
              <p>A subscription has been <strong>${data.action}</strong>!</p>
              
              <div class="customer-info">
                <h3>Customer Information:</h3>
                <p><strong>Name:</strong> ${data.customerName}</p>
                <p><strong>Email:</strong> ${data.customerEmail}</p>
              </div>
              
              <div class="details">
                <h3>Subscription Details:</h3>
                <p><strong>Subscription ID:</strong> <span class="highlight">${data.subscriptionId}</span></p>
                <p><strong>Plan:</strong> ${data.planName}</p>
                <p><strong>Price:</strong> £${data.price.toFixed(2)}/month</p>
                <p><strong>Action Date:</strong> ${new Date(data.actionDate).toLocaleDateString('en-GB')}</p>
              </div>
              
              <p><strong>Action Required:</strong> Please log into the admin dashboard to review subscription details and follow up with the customer if needed.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('Subscription admin notification email sent successfully:', result.data?.id || 'Email sent');
    return result;
  } catch (error) {
    console.error('Error sending subscription admin notification email:', error);
    throw error;
  }
}

export async function sendSubscriptionUpgradeEmail(data: SubscriptionUpgradeData) {
  const featuresList = data.features
    .map(feature => `<li style="margin-bottom: 8px; color: #374151;">${feature}</li>`)
    .join('');

  const changeType = data.isUpgrade ? 'upgraded' : 'downgraded';
  const changeColor = data.isUpgrade ? '#10B981' : '#F59E0B';

  try {
    await resend.emails.send({
      from: 'DustOut <noreply@dustout.co.uk>',
      to: data.to,
      subject: `Subscription ${data.isUpgrade ? 'Upgraded' : 'Changed'} - ${data.newPlanName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Subscription ${data.isUpgrade ? 'Upgrade' : 'Change'} Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">DustOut</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Professional Cleaning Services</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1a202c; margin-bottom: 20px;">Subscription ${data.isUpgrade ? 'Upgraded' : 'Updated'} Successfully!</h2>
            
            <p style="margin-bottom: 20px;">Dear ${data.customerName},</p>
            
            <p style="margin-bottom: 20px;">Your subscription has been successfully ${changeType}. Here are the details:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${changeColor}; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1a202c;">Subscription Details</h3>
              <p><strong>Subscription ID:</strong> ${data.subscriptionId}</p>
              <p><strong>Previous Plan:</strong> ${data.oldPlanName}</p>
              <p><strong>New Plan:</strong> ${data.newPlanName}</p>
              <p><strong>New Price:</strong> £${data.newPrice.toFixed(2)}/month</p>
              <p><strong>Effective Date:</strong> ${new Date(data.effectiveDate).toLocaleDateString('en-GB')}</p>
              <p><strong>Next Billing Date:</strong> ${new Date(data.nextBillingDate).toLocaleDateString('en-GB')}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1a202c;">Plan Features</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${featuresList}
              </ul>
            </div>
            
            ${data.isUpgrade ? `
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;"><strong>🎉 Thank you for upgrading!</strong> You now have access to enhanced features and priority support.</p>
            </div>
            ` : ''}
            
            <p style="margin: 20px 0;">If you have any questions about your subscription or need assistance, please don't hesitate to contact our support team.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center; color: #64748b; font-size: 14px;">
              <p>Thank you for choosing DustOut!</p>
              <p>Email: info@dustout.co.uk | Phone: +44 20 1234 5678</p>
              <p>Visit us: <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #667eea;">www.dustout.co.uk</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending subscription upgrade email:', error);
    throw error;
  }
}