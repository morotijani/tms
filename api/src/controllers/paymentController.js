const crypto = require('crypto');
const { Payment, Invoice, Voucher, User } = require('../models');

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

                await Voucher.create({
                    serialNumber,
                    pin,
                    status: 'Sold',
                    type: metadata.voucherType || 'Undergraduate',
                    price: amount / 100,
                    soldAt: new Date(),
                    transactionId: reference
                });

                // In a real app, send an SMS/Email to the customer with serial/pin
                console.log(`Voucher Generated: ${serialNumber} PIN: ${pin} for ${customer.email}`);
            }
        }
    }

    res.sendStatus(200);
};

module.exports = { handleWebhook };
