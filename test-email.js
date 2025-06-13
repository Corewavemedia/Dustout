require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('Testing Resend email configuration...');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev');
    
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'victorchiemelie@gmail.com', // Replace with your test email
      subject: 'Test Email from DustOut - Resend',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email sent using Resend from the DustOut application.</p>
        <p>If you receive this email, the Resend configuration is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Email ID:', result.data?.id || 'No ID returned');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    if (error.message) {
      console.error('Error message:', error.message);
    }
    
    if (error.name) {
      console.error('Error type:', error.name);
    }
  }
}

testEmail();