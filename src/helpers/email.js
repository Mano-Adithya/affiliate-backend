import nodemailer from "nodemailer";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler";
import throwError from "./throw-error.js";

dotenv.config();

const SendMail = expressAsyncHandler(async (data, req, res) => {
  const mailTransportOptions = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    // debug: true, // Enable debug mode for detailed SMTP logs
    // logger: true, // Enable logging for debug information
  };
  const transporter = nodemailer.createTransport(mailTransportOptions);

  const mailData = {
    from: process.env.MAIL_USER,
    ...data,
  };

  try {
    const info = await transporter.sendMail(mailData);
    if (info) {
      return true;
    }
    return false;
  } catch (error) {
    throwError(error);
  }
});

export default SendMail;
