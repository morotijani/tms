const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVoucherEmail = async (to, voucher) => {
    const mailOptions = {
        from: `"GUMS Admissions" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Voucher Purchase Successful - GUMS Admission',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0066ff; text-align: center;">Voucher Purchase Successful</h2>
                <p>Hello,</p>
                <p>Thank you for purchasing an admission voucher for <strong>GUMS</strong>. Your voucher details are below:</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase;">Serial Number</p>
                    <p style="margin: 0 0 15px 0; font-size: 24px; font-weight: bold; color: #0f172a;">${voucher.serialNumber}</p>
                    
                    <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase;">PIN</p>
                    <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0066ff;">${voucher.pin}</p>
                </div>

                <p><strong>Voucher Type:</strong> ${voucher.type}</p>
                <p><strong>Price Paid:</strong> GHS ${voucher.price}</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                
                <p style="font-size: 14px; color: #64748b;">
                    You can use these credentials to register and log in to the <a href="http://localhost:5173/register" style="color: #0066ff; text-decoration: none;">Applicant Portal</a> and start your application.
                </p>
                
                <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 40px;">
                    &copy; 2026 GUMS Admission System. All rights reserved.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Voucher email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending voucher email:', error);
        return false;
    }
};

module.exports = { sendVoucherEmail };
