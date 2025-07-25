import nodemailer from "nodemailer";
import {
  getVerificationTemplate,
  getResetTemplate,
  getDeleteTemplate,
} from "../email/temp/EmailTemplate.js";

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

export const SendEmail = async ({
  email,
  subject,
  message,
  emailType,
  attachments,
}) => {
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
      from: process.env.FROM_EMAIL || "codeshorts007@gmail.com",
      to: email,
      subject,
      html: htmlContent,
      attachments: attachments || [],
    };

    const result = await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    return false;
  }
};
