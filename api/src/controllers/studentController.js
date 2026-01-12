const { User, Course, Enrollment, Invoice, Payment, Program } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Get student profile and registration status
// @route   GET /api/student/dashboard
// @access  Private/Student
const getDashboard = async (req, res) => {
    try {
        const student = await User.findByPk(req.user.id, {
            include: [
                { model: Enrollment, include: [Course] },
                { model: Invoice }
            ]
        });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get available courses for registration (based on level/semester)
// @route   GET /api/student/available-courses
// @access  Private/Student
const getAvailableCourses = async (req, res) => {
    try {
        // In a real system, we'd filter by student's level and current semester
        const courses = await Course.findAll();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register for courses
// @route   POST /api/student/register-courses
// @access  Private/Student
const registerCourses = async (req, res) => {
    const { courseIds, academicYear, semester } = req.body;

    const t = await sequelize.transaction();

    try {
        const enrollments = courseIds.map(courseId => ({
            userId: req.user.id,
            courseId,
            academicYear,
            semester,
            status: 'Registered'
        }));

        await Enrollment.bulkCreate(enrollments, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Courses registered successfully' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's financial statement
// @route   GET /api/student/financials
// @access  Private/Student
const getFinancials = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            where: { userId: req.user.id },
            include: [Payment]
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboard,
    getAvailableCourses,
    registerCourses,
    getFinancials
};
