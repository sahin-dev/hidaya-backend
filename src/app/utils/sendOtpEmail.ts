import status from 'http-status';
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from './AppError';

const sendOtpEmail = async (email: string, otp: string, fullName: string) => {
  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.password,
      },
    });

    // Email HTML template with dynamic placeholders
    const htmlTemplate = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #faf9f6;
                margin: 0;
                padding: 0;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              }
              .header {
                text-align: center;
                padding: 20px;
                background-color: #f7e7d1;
                border-bottom: 2px solid #e6c9a8;
              }
              .header img {
                width: 150px;
                max-width: 100%;
                display: block;
                margin: 0 auto 15px;
                border-radius: 12px;
              }
              .header h2 {
                color: #a56b4f;
                margin: 0 0 8px;
                font-weight: bold;
                font-size: 24px;
                font-family: 'Georgia', serif;
              }
              .content {
                padding: 20px;
                font-size: 16px;
                line-height: 1.5;
                color: #5c4a3d;
              }
              .otp {
                background-color: #fcefcf;
                border-left: 5px solid #a56b4f;
                padding: 15px;
                font-size: 28px;
                font-weight: 700;
                text-align: center;
                margin: 25px 0;
                font-family: 'Courier New', Courier, monospace;
                letter-spacing: 6px;
                color: #7a563f;
                user-select: all;
              }
              .footer {
                text-align: center;
                padding: 15px 20px;
                font-size: 13px;
                color: #a99a8a;
                border-top: 2px solid #e6c9a8;
                font-style: italic;
              }
              @media (max-width: 600px) {
                .container {
                  width: 90%;
                }
                .header h2 {
                  font-size: 20px;
                }
                .otp {
                  font-size: 22px;
                  padding: 12px;
                  letter-spacing: 4px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Welcome to Hidaya</h2>
                <p>Your journey to spiritual growth starts here</p>
              </div>
              <div class="content">
                <p>Assalamu Alaikum ${fullName},</p>
                <p>Thank you for joining <strong>Hidaya - Your Islamic Tracker</strong>. To verify your email and activate your account, please use the one-time password (OTP) below:</p>
                <div class="otp">${otp}</div>
                <p>Please enter this OTP to complete your email verification. It will expire in 5 minutes.</p>
                <p>May your journey be blessed and fruitful.</p>
              </div>
              <div class="footer">
                <p>If you did not request this verification, please ignore this email.</p>
                <p>© 2025 Hidaya. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>

  `;

    // <img src="cid:steady_hands_logo" alt="Steady Hands Logo">

    // Email options: from, to, subject, and HTML body
    const mailOptions = {
      from: config.nodemailer.email, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Your OTP for Account Verification',
      html: htmlTemplate,
      // attachments: [
      //   {
      //     filename: 'logo.png',
      //     path: path.join(__dirname, 'assets', 'logo.png'),
      //     cid: 'steady_hands_logo',
      //   },
      // ],
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to send email');
  }
};

export default sendOtpEmail;
