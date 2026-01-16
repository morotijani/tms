const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getSubmittedApplications, updateApplicationStatus } = require('../controllers/registrarController');

// All registrar routes are protected and requires registrar role
router.use(protect);
router.use(authorize('registrar'));

router.get('/applications', getSubmittedApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

module.exports = router;
