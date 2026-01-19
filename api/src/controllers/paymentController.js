const crypto = require('crypto');
const { Payment, Invoice, Voucher, User, Setting } = require('../models');
const paystack = require('../utils/paystack');
const { sendVoucherEmail } = require('../utils/mail');
const { sendVoucherSMS } = require('../utils/sms');


// @desc    Handle Paystack Webhook
// @route   POST /api/payments/webhook
// @access  Public (Signature verified)
const handleWebhook = async (req, res) => {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(401).send('Unauthorized');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
        const { reference, metadata, amount, customer } = event.data;

        // Find existing payment record
        const payment = await Payment.findOne({ where: { reference } });

        if (payment) {
            await payment.update({ status: 'Success', paidAt: new Date() });

            // If it's a fee payment (linked to an invoice)
            if (payment.invoiceId) {
                const invoice = await Invoice.findByPk(payment.invoiceId);
                if (invoice) {
                    const totalPaid = await Payment.sum('amount', { where: { invoiceId: invoice.id, status: 'Success' } });
                    if (totalPaid >= invoice.amount) {
                        invoice.status = 'Paid';
                    } else {
                        invoice.status = 'Partially Paid';
                    }
                    await invoice.save();
                }
            }

            // If it's a voucher purchase (metadata could store voucher type)
            if (metadata?.type === 'voucher') {
                // Generate a new voucher for the user
                const serialNumber = 'V' + Math.floor(100000 + Math.random() * 900000);
                const pin = Math.floor(1000 + Math.random() * 9000).toString();

                const voucher = await Voucher.create({
                    serialNumber,
                    pin,
                    status: 'Sold',
                    type: metadata.voucherType || 'Undergraduate',
                    price: amount / 100,
                    soldAt: new Date(),
                    transactionId: reference
                });

                // Fetch Settings for Email
                const settingsList = await Setting.findAll();
                const settings = {};
                settingsList.forEach(s => settings[s.key] = s.value);

                // Send Email to the customer with serial/pin
                await sendVoucherEmail(customer.email, voucher, settings);

                // Send SMS
                const recipientPhone = metadata.phoneNumber || customer.phone || customer.phoneNumber || '';
                await sendVoucherSMS(recipientPhone, voucher, settings.schoolAbbreviation);

                console.log(`Voucher Generated: ${serialNumber} PIN: ${pin} for ${customer.email}`);
            }

        }
    }
    res.sendStatus(200);
};

// @desc    Initialize Voucher Purchase
// @route   POST /api/payments/initialize-voucher
// @access  Public
const initializeVoucherPurchase = async (req, res) => {
    const { email, phoneNumber, voucherType, amount, callback_url } = req.body;

    try {
        const metadata = {
            type: 'voucher',
            voucherType,
            phoneNumber
        };

        const response = await paystack.initializeTransaction(email, amount, metadata, callback_url);


        // Create a pending payment record
        await Payment.create({
            reference: response.data.reference,
            amount,
            email,
            status: 'Pending',
            type: 'Voucher',
            metadata: JSON.stringify(metadata)
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Voucher Purchase
// @route   GET /api/payments/verify-voucher/:reference
// @access  Public
const verifyVoucherTransaction = async (req, res) => {
    const { reference } = req.params;

    try {
        const verification = await paystack.verifyTransaction(reference);

        if (verification.data.status === 'success') {
            const { metadata, amount, customer, reference: paystackRef } = verification.data;

            // Check if payment already processed
            let payment = await Payment.findOne({ where: { reference: paystackRef } });

            if (payment && payment.status === 'Success') {
                // Already processed, find the voucher
                const voucher = await Voucher.findOne({ where: { transactionId: paystackRef } });
                return res.status(200).json({ status: 'success', voucher });
            }

            // If payment record exists but not success, update it
            if (payment) {
                await payment.update({ status: 'Success', paidAt: new Date() });
            } else {
                payment = await Payment.create({
                    reference: paystackRef,
                    amount: amount / 100,
                    email: customer.email,
                    status: 'Success',
                    type: 'Voucher',
                    paidAt: new Date(),
                    metadata: JSON.stringify(metadata)
                });
            }

            // Check if voucher already created
            let voucher = await Voucher.findOne({ where: { transactionId: paystackRef } });

            if (!voucher) {
                // Generate a new voucher
                const serialNumber = 'V' + Math.floor(100000 + Math.random() * 900000);
                const pin = Math.floor(1000 + Math.random() * 9000).toString();

                voucher = await Voucher.create({
                    serialNumber,
                    pin,
                    status: 'Sold',
                    type: metadata.voucherType || 'Undergraduate',
                    price: amount / 100,
                    soldAt: new Date(),
                    transactionId: paystackRef
                });

                // Fetch Settings for Email
                const settingsList = await Setting.findAll();
                const settings = {};
                settingsList.forEach(s => settings[s.key] = s.value);

                // Send Email to the customer with serial/pin
                await sendVoucherEmail(customer.email, voucher, settings);

                // Send SMS
                const recipientPhone = metadata.phoneNumber || customer.phone || customer.phoneNumber || '';
                await sendVoucherSMS(recipientPhone, voucher, settings.schoolAbbreviation);
            }


            res.status(200).json({ status: 'success', voucher });
        } else {
            res.status(400).json({ status: 'failed', message: 'Payment verification failed or pending' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleWebhook, initializeVoucherPurchase, verifyVoucherTransaction };
