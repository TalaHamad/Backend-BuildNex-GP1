import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'talahamd99@gmail.com',
    pass: 'aqvq hqsm uisl bnro',
  },
});

export const sendResetPasswordEmail = async (email, resetCode) => {
  const mailOptions = {
    from: 'talahamd99@gmail.com', // Your email address
    to: email,
    subject: 'Password Reset Request',
    html: `<h1>Reset your password?</h1> 
    <p>
    You have requested a password reset. 
    use the confirmation code below to complete the process. If you didn't make this request, ignore this email.
    <p>${resetCode}</p>
    </p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Email not sent: ' + error);
  }
};

export const generateUniqueCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  while (code.length < length) {
    const randomBytes = crypto.randomBytes(1);
    const randomIndex = randomBytes[0] % characters.length;
    code += characters.charAt(randomIndex);
  }

  return code;
};