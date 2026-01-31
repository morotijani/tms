const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createProgram, generateVouchers, admitApplicant, getApplications, updateProgram, deleteProgram,
    getPrograms, getGradingSchemes, createGradingScheme, updateGradingScheme, deleteGradingScheme,
    createCourse, getCoursesByProgram, deleteCourse, getStaffMembers, updateCourse
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

// Course Management
router.post('/courses', authorize('admin', 'registrar'), createCourse);
router.get('/courses/program/:programId', authorize('admin', 'registrar', 'staff'), getCoursesByProgram);
router.put('/courses/:id', authorize('admin', 'registrar'), updateCourse);
router.delete('/courses/:id', authorize('admin', 'registrar'), deleteCourse);

// Reporting & Exports
router.get('/export/nss', authorize('admin', 'registrar'), exportNSSData);

// Staff Fetching
router.get('/staff', authorize('admin', 'registrar'), getStaffMembers);

console.log('✅ Admin Routes Loaded with Course Management');

module.exports = router;

