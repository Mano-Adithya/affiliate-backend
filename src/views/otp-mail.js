export default (otp, name) => {
  return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
                <style>
                    body {
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background: #ffffff;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #333;
                    }
                    
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .header {
                        padding: 20px;
                        background-color: #ffffff;
                        text-align: center;
                        position: relative; 
                        height: 60px;
                        border-bottom: #8C193F solid;
                    }
                    
                    .header img.logo {
                        width: 160px;
                        height: auto;
                        position: absolute;
                        top: 60%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    
                    .content {
                        padding: 40px;
                        text-align: left;
                    }
                    
                    .otp {
                        font-size: 36px;
                        font-weight: bold;
                        color: #8C193F;
                        margin: 30px 0;
                        text-align: center;
                    }

                    
                    .footer {
                        text-align: center;
                        padding: 20px;
                        background: #000000;
                    }
                    
                    .footer-text {
                        color: #ffffff;
                        font-size: 14px;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="logo.png" alt="Logo" class="logo">
                    </div>
                    <div class="content">
                        <h2>Verify Your Account</h2>
                        <p>Hello ${name},</p>
                        <p>Your one-time password (OTP) for authentication is:</p>
                        <p class="otp">${otp}</p>
                        <p>This OTP will expire in 10 minutes. Please do not share this code with anyone.</p>
                        <p>If you didn't request this OTP, please ignore this email or contact support.</p>
                    </div>
                    <div class="footer">
                        <p class="footer-text">© 2024 Your Company. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};
