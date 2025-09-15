import nodemailer from "nodemailer";

export const contactForm = async (req, res) => {
  const { name, email, message } = req.body;

  // Validate that all required fields are present
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are required." });
  }

  try {
    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // Define email options
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender name and email
      to: process.env.EMAIL_USER, // Recipient (your email)
      subject: `New Contact Inquiry from ${name} - Please Review`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: 
        ${message}
      `,
      replyTo: email, // Allows replying directly to the sender
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ status: "success", message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send message, please try again later.",
    });
  }
};
