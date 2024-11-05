import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,  // SMTP host (e.g., smtp.gmail.com)
      port: 587,  // Use 465 for SSL
      secure: false,  // Set to true for port 465
      auth: {
        user: process.env.MAIL_USER,  // Your email address or SMTP username
        pass: process.env.MAIL_PASS,  // Your SMTP password or app-specific password
      },
    });

    let info = await transporter.sendMail({
      from: 'Padhle bsdk:-by Aryan',  // Your sender name
      to: email,  // Recipient email
      subject: title,  // Email subject
      html: body,  // Email body in HTML
    });

    console.log(info);
    return info;  // Return the info response for further use
  } catch (error) {
    console.error("Error sending mail:", error.message);
    throw new Error("Mail sending failed");
  }
};

export default mailSender;
