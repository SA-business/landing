import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'nathanho4321@gmail.com',
      pass: 'qwtvhgckpfevrlph'
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
