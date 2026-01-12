const { User, Course, Enrollment, Resource, Attendance, GradingScheme } = require('../models');


// @desc    Get lecturer's assigned courses
// @route   GET /api/staff/my-courses
// @access  Private/Staff
const getAssignedCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { instructorId: req.user.id },
            include: [{
                model: Enrollment,
                include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }]
            }]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload course resource
// @route   POST /api/staff/resources
// @access  Private/Staff
const uploadResource = async (req, res) => {
    const { title, type, courseId, fileUrl } = req.body;
    try {
        const resource = await Resource.create({
            title, type, courseId, fileUrl
        });
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit student grades
// @route   PATCH /api/staff/grades/:enrollmentId
// @access  Private/Staff
const updateGrades = async (req, res) => {
    const { caScore, examScore } = req.body;
    try {
        const enrollment = await Enrollment.findByPk(req.params.enrollmentId);
        if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

        const total = parseFloat(caScore) + parseFloat(examScore);
        let grade = 'F', point = 0.0;

        // Try to find dynamic grade from scheme
        const schemes = await GradingScheme.findAll({ order: [['minScore', 'DESC']] });
        if (schemes.length > 0) {
            const matched = schemes.find(s => total >= s.minScore);
            if (matched) {
                grade = matched.grade;
                point = matched.point;
            }
        } else {
            // Fallback to standard 4.0 if no scheme defined
            if (total >= 80) { grade = 'A'; point = 4.0; }
            else if (total >= 75) { grade = 'B+'; point = 3.5; }
            else if (total >= 70) { grade = 'B'; point = 3.0; }
            else if (total >= 65) { grade = 'C+'; point = 2.5; }
            else if (total >= 60) { grade = 'C'; point = 2.0; }
            else if (total >= 50) { grade = 'D'; point = 1.0; }
        }

        await enrollment.update({

            caScore,
            examScore,
            totalScore: total,
            grade,
            gradePoint: point,
            status: 'Completed'
        });

        res.json({ message: 'Grades updated successfully', enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record attendance
// @route   POST /api/staff/attendance
// @access  Private/Staff
const recordAttendance = async (req, res) => {
    const { studentId, courseId, isPresent } = req.body;
    try {
        const attendance = await Attendance.create({
            studentId, courseId, isPresent, date: new Date()
        });
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAssignedCourses,
    uploadResource,
    updateGrades,
    recordAttendance
};
