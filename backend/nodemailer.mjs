import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });
};

const sendEmail = (to, subject, text, html) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: 'nathanho4321@gmail.com',
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
};

export { sendEmail };
