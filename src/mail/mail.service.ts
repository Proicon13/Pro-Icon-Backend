import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { hostname } from "os";
// import { MailerOptions } from './mailer-options.interface';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Create a transporter using SMTP (or other options like Gmail, SendGrid, etc.)
    console.log("Email User:", process.env.EMAIL_USER, "Email Password:", process.env.EMAIL_PASSWORD);
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service : 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Method to send an email
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: '"pro-icon" <' + process.env.EMAIL_USER + ">", // Your sender email
      to: to,
      subject: subject,
      text: text, // Plain text body
      html: `<p>${text}</p>`, // HTML body (optional)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  }
}
