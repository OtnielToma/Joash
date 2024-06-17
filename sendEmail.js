const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const logFilePath = '/usr/share/nginx/html/joash/order_debug.log';

const sendEmail = (recipient_email, admin_email, orderId, items_table, total, shipping_info) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'joash.clothes@gmail.com',
      pass: 'ahjsnwhkytucvppp' // Make sure this is the correct App Password
    },
    debug: true, // Enable debug output
    logger: true // Log information
  });

  const { name, address, city, zip, method } = shipping_info;

  const body_html_customer = `
    <html>
    <head>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${orderId}</p>
      <p>Shipping Information:</p>
      <p>Name: ${name}</p>
      <p>Address: ${address}</p>
      <p>City: ${city}</p>
      <p>ZIP: ${zip}</p>
      <p>Shipping Method: ${method}</p>
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
    </body>
    </html>`;

  const body_html_admin = `
    <html>
    <head>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <h1>New Order Received</h1>
      <p>Order ID: ${orderId}</p>
      <p>Customer Name: ${name}</p>
      <p>Customer Email: ${recipient_email}</p>
      <p>Shipping Information:</p>
      <p>Address: ${address}</p>
      <p>City: ${city}</p>
      <p>ZIP: ${zip}</p>
      <p>Shipping Method: ${method}</p>
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

// Read command-line arguments
const args = process.argv.slice(2);
const [recipient_email, orderId, items_table, total, name, address, city, zip, method] = args;

// Clear the log file at the start
fs.writeFileSync(logFilePath, '');

// Log the command-line arguments
fs.appendFile(logFilePath, `Arguments: ${JSON.stringify(args)}\n`, (err) => {
  if (err) console.error('Failed to write to log file:', err);
});

// Construct shipping info object
const shipping_info = {
  name,
  address,
  city,
  zip,
  method
};

// Admin email address
const admin_email = 'joash.clothes@gmail.com';

// Call sendEmail with parsed arguments
sendEmail(recipient_email, admin_email, orderId, items_table, total, shipping_info);
