import nodemailer from "nodemailer";
import config from "../config/config.js";
import { getWelcomeTemplate } from "../constants/mails.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: config.email_user,
    clientId: config.mail_client_id,
    clientSecret: config.mail_client_secret,
    refreshToken: config.refresh_token,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const sendMail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking App" <${config.email_user}>`,
      to,
      subject,
      text,
      html: getWelcomeTemplate(text, subject),
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

const sendRegistrationEmail = async ({ to, name }) => {
  await sendMail({
    to,
    subject: "Welcome to our platform",
    text: `Dear ${name}, Welcome to our platform. You are now registered with us.`,
  });
};

const sendTransactionNotificationEmail = async ({ to, name, amount, type }) => {
  await sendMail({
    to,
    subject: "Transaction Notification",
    text: `Dear ${name}, A transaction of ${amount} has been made from your account.`,
  });
};

const sendFailedTransactionEmail = async ({ to, name, message }) => {
  await sendMail({
    to,
    subject: "Failed Transaction",
    text: `Dear ${name}, Your transaction has failed. ${message}. Please try again.`,
  });
};

export {
  sendRegistrationEmail,
  sendTransactionNotificationEmail,
  sendFailedTransactionEmail,
};
