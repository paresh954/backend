import express from "express";
const router = express.Router();
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting us!",
      html: `
    <h2>Hi ${name},</h2>
    <p>Thank you for connecting with us. We have received your message:</p>
    <blockquote>${message}</blockquote>
    <p>We'll get back to you soon.</p>
    <br />
    <p>Best regards,<br>Paresh Daki</p>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent and saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

export default router;
