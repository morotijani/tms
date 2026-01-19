const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVoucherEmail = async (to, voucher, settings) => {
    const schoolName = settings?.schoolName || 'GUMS';
    const schoolAbbreviation = settings?.schoolAbbreviation || 'GUMS';

    const mailOptions = {
        from: `"${schoolAbbreviation} Admissions" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Voucher Purchase Successful - ${schoolAbbreviation} Admission`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0066ff; text-align: center;">Voucher Purchase Successful</h2>
                <p>Hello,</p>
                <p>Thank you for purchasing an admission voucher for <strong>${schoolName}</strong>. Your voucher details are below:</p>
                
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
                    &copy; ${new Date().getFullYear()} ${schoolName} Admission System. All rights reserved.
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

const sendAdmissionEmail = async (to, user, programName, filePath, settings) => {
    const schoolName = settings?.schoolName || 'GUMS';
    const schoolAbbreviation = settings?.schoolAbbreviation || 'GUMS';

    const mailOptions = {
        from: `"${schoolAbbreviation} Registrar" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Offer of Admission - Congratulations!',
        html: `
			<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
				<h2 style="color: #10b981; text-align: center;">Congratulations, ${user.firstName}!</h2>
				<p>We are pleased to inform you that you have been offered provisional admission to study <strong>${programName}</strong> at <strong>${schoolName}</strong>.</p>
				
				<div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
					<p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase;">Your Student ID</p>
					<p style="margin: 0 0 5px 0; font-size: 24px; font-weight: bold; color: #0f172a;">${user.studentId}</p>
					<p style="margin: 0; font-size: 12px; color: #64748b;">Use this ID to login to the Student Portal.</p>
				</div>

				<p>Please find your official <strong>Admission Letter</strong> attached to this email. You are required to print it out and present it during registration.</p>
				
				<p style="margin-top: 30px;">
					<a href="http://localhost:5173/student" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Student Portal</a>
				</p>
				
				<p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 40px;">
					&copy; ${new Date().getFullYear()} ${schoolName} Admission System. All rights reserved.
				</p>
			</div>
		`,
        attachments: [
            {
                filename: 'Admission_Letter.pdf',
                path: filePath
            }
        ]
    };

    if (!fs.existsSync(filePath)) {
        console.error(`Attachment not found at path: ${filePath}`);
        return false;
    }

    try {
        console.log(`Attempting to send admission email to: ${to}`);
        console.log(`Using attachment path: ${filePath}`);

        const info = await transporter.sendMail(mailOptions);
        console.log(`Admission email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('FAILED to send admission email.');
        console.error('Error Details:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
};

module.exports = { sendVoucherEmail, sendAdmissionEmail };
