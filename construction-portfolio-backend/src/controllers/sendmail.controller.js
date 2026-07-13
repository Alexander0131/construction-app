const nodemailer = require("nodemailer");
const Message = require("../models/Message");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Saves the contact message and emails the site owner. Persisting first
// means the message isn't lost if the email step fails.
exports.sendMessage = async (req, res, next) => {
  try {
    const { yourName, yourEmail, yourSubject, yourMessage } = req.body;

    if (!yourName || !yourEmail || !yourSubject || !yourMessage) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const saved = await Message.create({ yourName, yourEmail, yourSubject, yourMessage });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        replyTo: yourEmail,
        to: process.env.CONTACT_RECIPIENT || process.env.EMAIL_USER,
        subject: `[Website] ${yourSubject}`,
        html: `<p>${yourMessage}</p><p>From: ${yourName} (${yourEmail})</p>`,
      });
    } catch (emailError) {
      // Message is already saved — surface a soft warning but don't fail the request.
      console.error("Failed to send notification email:", emailError.message);
    }

    res.status(200).json({ success: true, data: { success: true, message: "Message sent" }, saved });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};
