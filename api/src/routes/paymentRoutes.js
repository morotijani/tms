const express = require('express');
const router = express.Router();
const { handleWebhook, initializeVoucherPurchase, verifyVoucherTransaction } = require('../controllers/paymentController');

// Paystack webhook doesn't need 'protect' middleware but needs signature verification
router.post('/webhook', handleWebhook);
router.post('/initialize-voucher', initializeVoucherPurchase);
router.get('/verify-voucher/:reference', verifyVoucherTransaction);



module.exports = router;
