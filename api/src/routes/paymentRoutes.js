const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/paymentController');

// Paystack webhook doesn't need 'protect' middleware but needs signature verification
router.post('/webhook', handleWebhook);

module.exports = router;
