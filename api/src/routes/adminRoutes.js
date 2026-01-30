const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createProgram, generateVouchers, admitApplicant, getApplications, updateProgram, deleteProgram,
    getPrograms, getGradingSchemes, createGradingScheme, updateGradingScheme, deleteGradingScheme
} = require('../controllers/adminController');
const { exportNSSData } = require('../controllers/exportController');


router.use(protect);

// Program Management
router.post('/programs', authorize('admin', 'registrar'), createProgram);
router.get('/programs', authorize('admin', 'registrar'), getPrograms);
router.put('/programs/:id', authorize('admin', 'registrar'), updateProgram);
router.delete('/programs/:id', authorize('admin', 'registrar'), deleteProgram);

// Voucher Management
router.post('/vouchers/generate', authorize('admin'), generateVouchers);

// Admission Management
router.get('/applications', authorize('admin', 'registrar'), getApplications);
router.post('/admission/admit/:id', authorize('admin', 'registrar'), admitApplicant);

// Grading Scheme Management
router.get('/gradings', authorize('admin'), getGradingSchemes);
router.post('/gradings', authorize('admin'), createGradingScheme);
router.put('/gradings/:id', authorize('admin'), updateGradingScheme);
router.delete('/gradings/:id', authorize('admin'), deleteGradingScheme);

// Reporting & Exports
router.get('/export/nss', authorize('admin', 'registrar'), exportNSSData);



module.exports = router;

