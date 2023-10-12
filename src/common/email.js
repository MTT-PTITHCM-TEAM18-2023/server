import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false,
    auth: {
      user: 'nhankk21@gmail.com', 
      pass: '142359429925CEE33F31DAD9D421075DA52B'  
    }
});

export async function sendEmail(_to, subject, text) {
  try {
    const to = _to.toLowerCase();
    await transporter.sendMail({
      from: "nhankk21@gmail.com", 
      to,                           
      subject,                      
      html: '<p>' + text + '</p>',     
    });
  } catch (error) {
    throw error
  }
}

// Example usage:
// sendEmail('recipient@example.com', 'Hello', 'This is a test email.');
