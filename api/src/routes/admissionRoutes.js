const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getPrograms, submitApplication, uploadDocuments, getMyApplication } = require('../controllers/admissionController');

// Public route to see programs
router.get('/programs', getPrograms);

// Protected routes for applicants
router.get('/my-application', protect, authorize('applicant', 'student'), getMyApplication);

router.post('/apply', protect, authorize('applicant', 'student'), submitApplication);


router.post('/upload', protect, authorize('applicant', 'student'), upload.fields([
    { name: 'resultSlip', maxCount: 1 },
    { name: 'resultSlip2', maxCount: 1 },
    { name: 'resultSlip3', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'transcript', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 }
]), uploadDocuments);



module.exports = router;
