const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

AWS.config.update({ region: 'us-east-1' });

const ses = new AWS.SES();

app.post('/order', (req, res) => {
    const { email, items } = req.body;

    const orderDetails = items.map(item => `${item.name}: ${item.quantity}`).join('\n');

    const params = {
        Source: 'tomadanielotniel@gmail.com',
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: { Data: 'Order Confirmation' },
            Body: {
                Text: { Data: `Thank you for your order! \n\nYour order details:\n${orderDetails}` }
            }
        }
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error sending email');
        } else {
            res.send('Order placed and email sent');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
