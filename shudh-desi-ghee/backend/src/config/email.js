import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates SMTP environment variables and creates Nodemailer transporter.
 * Fails loud if any required environment variable is missing when attempting to create/verify transporter.
 */
export const validateEmailConfig = () => {
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM_EMAIL'];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `[EMAIL CONFIG ERROR] Missing required SMTP environment variables: ${missing.join(', ')}. ` +
      `Please define these in your .env file.`
    );
  }
};

/**
 * Creates reusable Nodemailer transporter.
 */
export const createEmailTransporter = () => {
  validateEmailConfig();
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Safely sends an email wrapped in try/catch so email failures NEVER break or roll back parent operations.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createEmailTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || `"SURANGHI NAAR" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`[EMAIL SENT] MessageId: ${info.messageId} | Sent to: ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error.message || error);
    return { success: false, error: error.message };
  }
};
