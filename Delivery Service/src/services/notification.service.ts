import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendDeliveryNotification = async (to: string, subject: string, message: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,           // e.g., smtp.gmail.com
    port: Number(process.env.EMAIL_PORT),     // e.g., 465 or 587
    secure: process.env.EMAIL_SECURE === 'true',// true for 465, false for others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text: message,
  });
};
