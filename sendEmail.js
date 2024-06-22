const nodemailer = require('nodemailer');
const fs = require('fs');

const logFilePath = 'order_debug.log';

const sendEmail = (recipient_email, admin_email, orderId, items_table, total, shipping_info) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'joash.clothes@gmail.com',
            pass: 'ahjsnwhkytucvppp'
        },
        debug: true,
        logger: true
    });

    const { name, address, city, zip, method, phone } = shipping_info;

    const body_html_customer = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Order!</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            body {
                font-family: 'Bebas Neue', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
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
                text-align: left;
                padding: 20px 0;
            }
            .content h1 {
                font-size: 24px;
                color: #333333;
                margin-bottom: 10px;
            }
            .content p {
                font-size: 16px;
                color: #666666;
                margin-bottom: 5px;
            }
            .table-container {
                margin: 20px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-size: 14px;
            }
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                padding: 20px 0;
                font-size: 14px;
                color: #999999;
            }
            .footer a {
                color: #007BFF;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">JOASH</div>
            </div>
            <div class="content">
                <h1>Thank you for your order!</h1>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <h2>Shipping Information:</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>City:</strong> ${city}</p>
                <p><strong>ZIP:</strong> ${zip}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Shipping Method:</strong> ${method}</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items_table}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" style="text-align:right;"><strong>Grand Total</strong></td>
                                <td><strong>${total} Lei</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2024 Joash. All rights reserved.</p>
                <p>Contact us: <a href="mailto:support@joash.com">support@joash.com</a></p>
            </div>
        </div>
    </body>
    </html>`;

    const body_html_admin = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Received</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
            body {
                font-family: 'Bebas Neue', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
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
                text-align: left;
                padding: 20px 0;
            }
            .content h1 {
                font-size: 24px;
                color: #333333;
                margin-bottom: 10px;
            }
            .content p {
                font-size: 16px;
                color: #666666;
                margin-bottom: 5px;
            }
            .table-container {
                margin: 20px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-size: 14px;
            }
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                padding: 20px 0;
                font-size: 14px;
                color: #999999;
            }
            .footer a {
                color: #007BFF;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">JOASH</div>
            </div>
            <div class="content">
                <h1>New Order Received</h1>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Customer Email:</strong> ${recipient_email}</p>
                <h2>Shipping Information:</h2>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>City:</strong> ${city}</p>
                <p><strong>ZIP:</strong> ${zip}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Shipping Method:</strong> ${method}</p>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items_table}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" style="text-align:right;"><strong>Grand Total</strong></td>
                                <td><strong>${total} Lei</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2024 Joash. All rights reserved.</p>
                <p>Contact us: <a href="mailto:support@joash.com">support@joash.com</a></p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptionsCustomer = {
        from: 'joash.clothes@gmail.com',
        to: recipient_email,
        subject: `Order Confirmation - Order #${orderId}`,
        html: body_html_customer
    };

    const mailOptionsAdmin = {
        from: 'joash.clothes@gmail.com',
        to: admin_email,
        subject: `New Order Received - Order #${orderId}`,
        html: body_html_admin
    };

    transporter.sendMail(mailOptionsCustomer, (error, info) => {
        if (error) {
            console.error('Error sending email to customer:', error);
            fs.appendFile(logFilePath, `Error sending email to customer: ${error}\n`, (err) => {
                if (err) console.error('Failed to write to log file:', err);
            });
        } else {
            console.log('Customer email sent:', info.response);
            fs.appendFile(logFilePath, `Customer email sent: ${info.response}\n`, (err) => {
                if (err) console.error('Failed to write to log file:', err);
            });
        }
    });

    transporter.sendMail(mailOptionsAdmin, (error, info) => {
        if (error) {
            console.error('Error sending email to admin:', error);
            fs.appendFile(logFilePath, `Error sending email to admin: ${error}\n`, (err) => {
                if (err) console.error('Failed to write to log file:', err);
            });
        } else {
            console.log('Admin email sent:', info.response);
            fs.appendFile(logFilePath, `Admin email sent: ${info.response}\n`, (err) => {
                if (err) console.error('Failed to write to log file:', err);
            });
        }
    });
};

const args = process.argv.slice(2);
const [recipient_email, orderId, items_table, total, name, address, city, zip, method, phone] = args;

fs.writeFileSync(logFilePath, '');

fs.appendFile(logFilePath, `Arguments: ${JSON.stringify(args)}\n`, (err) => {
    if (err) console.error('Failed to write to log file:', err);
});

const shipping_info = {
    name,
    address,
    city,
    zip,
    method,
    phone
};

const admin_email = 'joash.clothes@gmail.com';

sendEmail(recipient_email, admin_email, orderId, items_table, total, shipping_info);
