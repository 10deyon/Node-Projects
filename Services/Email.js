const nodemailer = require('nodemailer');

sendEmailToUser = async function (options) {
    // create a transporter
    const transporter = await nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
        // Activate in gmail, 'less secure app' option
    })
    
    console.log(transporter);

    // define email options
    const mailOptions = {
        from: 'imanuelDeyon <admin@test.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }
    // send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmailToUser;
