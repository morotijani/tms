const axios = require('axios');

const sendSMS = async (to, message) => {
    const apiKey = process.env.ARKESEL_API_KEY;
    const senderId = process.env.ARKESEL_SENDER_ID || 'PNTC ADM';

    if (!apiKey) {
        console.warn('ARKESEL_API_KEY is not set. SMS will not be sent.');
        return false;
    }

    try {
        const url = 'https://sms.arkesel.com/api/v2/sms/send';
        const data = {
            sender: senderId,
            message: message,
            recipients: [to]
        };

        const response = await axios.post(url, data, {
            headers: {
                'api-key': apiKey
            }
        });

        if (response.data && response.data.status === 'success') {
            console.log(`SMS sent successfully to ${to}`);
            return true;
        } else {
            console.error('Failed to send SMS:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return false;
    }
};

const sendVoucherSMS = async (to, voucher, schoolAbbreviation) => {
    const message = `Voucher Purchased!\nSchool: ${schoolAbbreviation}\nSerial: ${voucher.serialNumber}\nPIN: ${voucher.pin}\nUse these to apply.`;
    return await sendSMS(to, message);
};

const sendAdmissionSMS = async (to, user, programName, schoolAbbreviation) => {
    const message = `Congrats ${user.firstName}!\nYou have been admitted to ${programName} at ${schoolAbbreviation}.\nYour Student ID: ${user.studentId}.\nCheck your email for details.`;
    return await sendSMS(to, message);
};

module.exports = { sendSMS, sendVoucherSMS, sendAdmissionSMS };
