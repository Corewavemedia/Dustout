const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env' });

// Create transporter using the same configuration as the app
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('Port:', process.env.EMAIL_PORT);
  console.log('Secure:', process.env.EMAIL_SECURE);
  console.log('User:', process.env.EMAIL_USER);
  console.log('From:', process.env.EMAIL_FROM);
  console.log('Admin Email:', process.env.ADMIN_EMAIL);
  
  try {
    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Send test email
    const testMailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'DustOut Email Test',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from your DustOut application.</p>
        <p>If you receive this email, your email configuration is working correctly.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    };
    
    const result = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔍 Authentication failed. Please check:');
      console.error('- EMAIL_USER is correct');
      console.error('- EMAIL_PASS is correct');
      console.error('- Your email provider allows SMTP access');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔍 Connection failed. Please check:');
      console.error('- EMAIL_HOST is correct');
      console.error('- EMAIL_PORT is correct');
      console.error('- EMAIL_SECURE setting matches the port');
    }
  }
}

testEmail();