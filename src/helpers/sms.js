import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function sendSms(phone, otp) {
  let apiKey = process.env.TEXTLOCAL_API_KEY;
  const message = `Your login OTP: ${otp}. Please use it to access your account securely. Do not share it with anyone. Thank you for choosing us! - albionpropertyhub.com`;
  const numbers = encodeURIComponent(phone);
  const sender = encodeURIComponent("ALBION");
  const data = {
    apikey: apiKey,
    numbers: [numbers],
    sender: sender,
    message: message,
  };
  try {
    const response = await axios.get(
      `https://api.textlocal.in/send/?apikey=${apiKey}&numbers=${numbers}&sender=ALBION&message=${message}`
    );
    // console.log(response, "response");
    if (response.data.status === "failure") {
    //   console.error("SMS sending failed:", response.data.errors);
      throw new Error(response.data.errors);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default sendSms;
