const nodemailer = require('nodemailer');
const fs = require('fs');

const sendVerificationEmail = (recipient_email, verification_code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'joash.clothes@gmail.com',
      pass: 'ahjsnwhkytucvppp' 
    }
  });

  const body_html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Joash</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

            body {
                font-family: 'Bebas Neue', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #dddddd;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
            }
            .logo {
                font-family: 'Bebas Neue', sans-serif;
                font-weight: bold;
                font-size: 48px;
                color: #ffffff;
                background-color: #000000;
                display: inline-block;
                padding: 10px 20px;
                border-radius: 4px;
            }
            .content {
                text-align: center;
            }
            .content h1 {
                font-size: 32px;
                color: #333333;
            }
            .content p {
                font-size: 18px;
                color: #666666;
            }
            .verification-code {
                font-size: 24px;
                color: #ffffff;
                background-color: #333333;
                padding: 10px;
                border-radius: 4px;
                display: inline-block;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 20px 0;
                font-size: 14px;
                color: #999999;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">JOASH</div>
            </div>
            <div class="content">
                <h1>Welcome to Joash</h1>
                <p>Thank you for joining Joash. We're thrilled to have you with us.</p>
                <div class="verification-code">${verification_code}</div>
            </div>
            <div class="footer">
                <p>&copy; 2024 Joash. All rights reserved.</p>
                <p>Contact us: <a href="mailto:support@joash.com">support@joash.com</a></p>
            </div>
        </div>
    </body>
    </html>`;

  const mailOptions = {
    from: 'joash.clothes@gmail.com',
    to: recipient_email,
    subject: 'Email Verification',
    html: body_html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      fs.appendFileSync('order_debug.log', `Error sending email: ${error}\n`);
    } else {
      console.log('Verification email sent:', info.response);
      fs.appendFileSync('order_debug.log', `Verification email sent: ${info.response}\n`);
    }
  });
};

const args = process.argv.slice(2);
const [recipient_email, verification_code] = args;

sendVerificationEmail(recipient_email, verification_code);
