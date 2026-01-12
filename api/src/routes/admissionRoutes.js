const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getPrograms, submitApplication, uploadDocuments } = require('../controllers/admissionController');

// Public route to see programs
router.get('/programs', getPrograms);

// Protected routes for applicants
router.get('/my-application', protect, authorize('applicant'), getMyApplication);

router.post('/apply', protect, authorize('applicant'), submitApplication);


router.post('/upload', protect, authorize('applicant'), upload.fields([
    { name: 'resultSlip', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'transcript', maxCount: 1 }
]), uploadDocuments);

module.exports = router;
