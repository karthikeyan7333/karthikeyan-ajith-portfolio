import { Request, Response } from "express";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Contact from "../models/Contact";
import { isMongoDBConnected } from "../config/db";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

// Helper to save contact locally when MongoDB is not connected
function saveLocally(data: { name: string; email: string; subject: string; message: string }) {
  const dirPath = path.join(process.cwd(), "data");
  const filePath = path.join(dirPath, "contacts.json");

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let contacts = [];
  if (fs.existsSync(filePath)) {
    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      contacts = JSON.parse(fileData);
    } catch (e) {
      contacts = [];
    }
  }

  const newContact = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), "utf-8");
  return newContact;
}
export async function submitContact(req: Request, res: Response) {
  try {
    const { name, email, subject, message } = req.body ?? {};

    // 1. Validation
    if ([name, email, subject, message].some((value) => typeof value !== "string" || !value.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };

    if (contactData.name.length > 100 || contactData.email.length > 254 || contactData.subject.length > 200 || contactData.message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Please keep the name, email, subject, and message within the allowed length.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(contactData.email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // 2. Storage in MongoDB or Local fallback
    let savedContact;
    if (isMongoDBConnected) {
      savedContact = await Contact.create(contactData);
    } else {
      savedContact = saveLocally(contactData);
    }

    // 3. Email notification is best-effort; contact submissions are saved first.
    let emailSent = false;
    let emailError = "";
    let previewUrl = "";
    const smtpValues = [process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.EMAIL_USER, process.env.EMAIL_PASS];
    const smtpConfigured = smtpValues.every(Boolean);
    const smtpPartiallyConfigured = smtpValues.some(Boolean) && !smtpConfigured;

    if (!smtpConfigured && process.env.NODE_ENV === "production") {
      emailError = "Email notification is not configured.";
    } else if (smtpPartiallyConfigured) {
      emailError = "Email notification is not configured correctly.";
    } else try {
      let transporter;
      let fromAddress: string;

      if (smtpConfigured) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST!,
          port: Number(process.env.SMTP_PORT),
          secure: process.env.SMTP_PORT === "465",
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 6000,
          auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
          },
        });
        fromAddress = process.env.EMAIL_USER!;
      } else {
        // Keep the Ethereal preview fallback for local development only.
        const testAccount = await withTimeout(
          nodemailer.createTestAccount(),
          5000,
          "Timed out creating the Ethereal test account",
        );
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 6000,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        fromAddress = testAccount.user;
      }

      const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!);
      const safeName = escapeHtml(contactData.name);
      const safeEmail = escapeHtml(contactData.email);
      const safeSubject = escapeHtml(contactData.subject);
      const safeMessage = escapeHtml(contactData.message).replace(/\n/g, "<br>");
      const mailOptions = {
        from: fromAddress,
        replyTo: contactData.email,
        to: process.env.CONTACT_RECEIVER_EMAIL || "karthikeyankesu4@gmail.com",
        subject: `Portfolio Contact: ${contactData.subject}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 12px; color: #f3f4f6; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px;">New Portfolio Inquiry</h2>
              <p style="margin: 5px 0 0; color: #e2e8f0; font-size: 14px;">You have received a new message from Karthikeyan Ajith Portfolio</p>
            </div>
            <div style="padding: 30px; line-height: 1.6;">
              <div style="margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">
                <p style="margin: 5px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Sender Details</p>
                <p style="margin: 5px 0; font-size: 16px; font-weight: 600;"><strong style="color: #3b82f6;">Name:</strong> ${safeName}</p>
                <p style="margin: 5px 0; font-size: 16px;"><strong style="color: #3b82f6;">Email:</strong> <a href="mailto:${safeEmail}" style="color: #06b6d4; text-decoration: none;">${safeEmail}</a></p>
                <p style="margin: 5px 0; font-size: 16px;"><strong style="color: #3b82f6;">Subject:</strong> ${safeSubject}</p>
              </div>
              <div>
                <p style="margin: 5px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase;">Message Content</p>
                <div style="background-color: #111827; border-left: 4px solid #8b5cf6; padding: 15px; border-radius: 4px; font-style: italic; color: #e5e7eb; margin-top: 5px;">
                  ${safeMessage}
                </div>
              </div>
            </div>
            <div style="background-color: #111827; padding: 15px; text-align: center; border-top: 1px solid #1e293b;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; 2026 Karthikeyan Ajith Portfolio. Live Premium Inquiries Panel.</p>
            </div>
          </div>
        `,
      };

      let info;
      try {
        info = await withTimeout(
          transporter.sendMail(mailOptions),
          8000,
          "Timed out sending the contact notification",
        );
      } finally {
        transporter.close();
      }
      emailSent = true;

      if (info.messageId && info.host === "smtp.ethereal.email") {
        previewUrl = nodemailer.getTestMessageUrl(info) || "";
        console.log("📬 Fallback Test Email Sent! View here:", previewUrl);
      }
    } catch (err: any) {
      console.error("✉️ Nodemailer send error:", err.message);
      emailError = "Email notification could not be sent.";
    }

    res.status(201).json({
      success: true,
      message: "Message submitted successfully!",
      databaseStatus: isMongoDBConnected ? "MongoDB" : "Local JSON",
      emailSent,
      previewUrl,
      emailError,
      data: savedContact,
    });
  } catch (err: any) {
    console.error("❌ Controller error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error occurred. Please try again later.",
    });
  }
}
