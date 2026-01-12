const { Invoice, Payment, User } = require('../models');

// @desc    Get all invoices
// @route   GET /api/finance/invoices
// @access  Private/Accountant
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate invoice for a student
// @route   POST /api/finance/invoices
// @access  Private/Accountant
const createInvoice = async (req, res) => {
    const { userId, title, amount, dueDate, academicYear, semester } = req.body;
    try {
        const invoice = await Invoice.create({
            userId, title, amount, dueDate, academicYear, semester
        });
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record manual payment
// @route   POST /api/finance/payments
// @access  Private/Accountant
const recordManualPayment = async (req, res) => {
    const { userId, invoiceId, amount, method, reference } = req.body;
    try {
        const payment = await Payment.create({
            userId, invoiceId, amount, method, reference, status: 'Success', paidAt: new Date()
        });

        // Update invoice status
        const invoice = await Invoice.findByPk(invoiceId);
        if (invoice) {
            const totalPaid = await Payment.sum('amount', { where: { invoiceId } });
            if (totalPaid >= invoice.amount) {
                invoice.status = 'Paid';
            } else if (totalPaid > 0) {
                invoice.status = 'Partially Paid';
            }
            await invoice.save();
        }

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllInvoices,
    createInvoice,
    recordManualPayment
};
