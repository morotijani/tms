const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllInvoices,
    createInvoice,
    recordManualPayment,
    getPurchasedVouchers
} = require('../controllers/financeController');

router.use(protect);
router.use(authorize('accountant', 'admin'));

router.get('/invoices', getAllInvoices);
router.get('/vouchers', getPurchasedVouchers);
router.post('/invoices', createInvoice);
router.post('/payments', recordManualPayment);

module.exports = router;
