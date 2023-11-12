import crypto from 'crypto';
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

async function sendEmail(_to, subject, text) {
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

function hashPassword(password) {
    const hash = crypto.createHash('md5').update(password).digest('hex');
    return hash;
}

const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateRandomString(length) {

    let result = '';
    const charSetLength = charSet.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSetLength);
      result += charSet[randomIndex];
    }
    return result;
    
}

function isNumber(value) {
    return typeof value === 'number';
}

function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

const CommonMethod = {
    sendEmail,
    hashPassword,
    generateRandomString,
    isValidEmail,
    isNumber,
}

export default CommonMethod