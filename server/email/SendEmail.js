import nodemailer from "nodemailer";
import {
  getVerificationTemplate,
  getResetTemplate,
  getDeleteTemplate,
} from "../email/temp/EmailTemplate.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMPT_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const SendEmail = async ({ email, subject, message, emailType, attachments }) => {
  try {
    let htmlContent;

    switch (emailType) {
      case "VERIFY":
        subject = "Verify your email";
        htmlContent = getVerificationTemplate(message);
        break;
      case "DELETE":
        subject = "Delete your account";
        htmlContent = getDeleteTemplate(message);
        break;
      case "RESET":
        subject = "Reset your password";
        htmlContent = getResetTemplate(message);
        break;
      default:
        htmlContent = message;
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject,
      html: htmlContent,
      attachments: attachments || []
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};