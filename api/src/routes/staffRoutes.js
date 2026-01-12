const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAssignedCourses,
    uploadResource,
    updateGrades,
    recordAttendance
} = require('../controllers/staffController');

router.use(protect);
router.use(authorize('staff', 'admin'));

router.get('/my-courses', getAssignedCourses);
router.post('/resources', uploadResource);
router.patch('/grades/:enrollmentId', updateGrades);
router.post('/attendance', recordAttendance);

module.exports = router;
