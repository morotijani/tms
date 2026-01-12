const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createProgram, generateVouchers, admitApplicant, getApplications } = require('../controllers/adminController');
const { exportNSSData } = require('../controllers/exportController');


router.use(protect);

// Program Management
router.post('/programs', authorize('admin', 'registrar'), createProgram);

// Voucher Management
router.post('/vouchers/generate', authorize('admin'), generateVouchers);

// Admission Management
router.get('/applications', authorize('admin', 'registrar'), getApplications);
router.post('/admission/admit/:id', authorize('admin', 'registrar'), admitApplicant);

// Reporting & Exports
router.get('/export/nss', authorize('admin', 'registrar'), exportNSSData);



module.exports = router;

