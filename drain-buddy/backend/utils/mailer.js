import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(toEmail, code, roleLabel) {
  await transporter.sendMail({
    from: `"Drain-Buddy" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Drain-Buddy verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Hi,</p><p>Your Drain-Buddy${roleLabel ? " " + roleLabel : ""} verification code is:</p><h2 style="letter-spacing:4px">${code}</h2><p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
  });
}