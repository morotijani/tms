const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getDashboard,
    getAvailableCourses,
    registerCourses,
    getFinancials
} = require('../controllers/studentController');

router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/available-courses', getAvailableCourses);
router.post('/register-courses', registerCourses);
router.get('/financials', getFinancials);

module.exports = router;
