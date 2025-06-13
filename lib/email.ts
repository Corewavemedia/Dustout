import nodemailer from 'nodemailer';

// Create transporter using cPanel email settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!, // Your cPanel email host
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER!, // Your email address
    pass: process.env.EMAIL_PASS!, // Your email password
  },
});

interface BookingConfirmationData {
  to: string;
  customerName: string;
  bookingId: string;
  services: any[];
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
  services: any[];
  preferredDate: string;
  preferredTime: string;
  totalAmount: number;
  address: string;
  specialInstructions?: string;
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  const servicesList = data.services
    .map(service => {
      const variables = service.selectedVariables
        .map((v: any) => `${v.variableName}: ${v.variableValue}`)
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

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: data.to,
    subject: `Booking Confirmation - ${data.bookingId}`,
    html: htmlContent,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent successfully:', result.messageId);
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
        .map((v: any) => `${v.variableName}: ${v.variableValue}`)
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

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🚨 New Booking Alert - ${data.bookingId}`,
    html: htmlContent,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
}

export async function sendSchedulingConfirmationEmail(data: {
  to: string;
  customerName: string;
  bookingId: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedStaff: string;
  services: any[];
  address: string;
}) {
  const servicesList = data.services
    .map(service => {
      const variables = service.selectedVariables
        .map((v: any) => `${v.variableName}: ${v.variableValue}`)
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

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: data.to,
    subject: `Booking Scheduled - ${data.bookingId}`,
    html: htmlContent,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Scheduling confirmation email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending scheduling confirmation email:', error);
    throw error;
  }
}