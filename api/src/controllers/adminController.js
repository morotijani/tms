const { Application, User, Program, Voucher, Setting, GradingScheme, Course, Role } = require('../models');
const crypto = require('crypto');
const { generateAdmissionLetter } = require('../utils/pdfGenerator');
const { sendAdmissionEmail } = require('../utils/mail');
const { sendAdmissionSMS } = require('../utils/sms');

// @desc    Create a new academic program
// @route   POST /api/admin/programs
// @access  Private/Admin/Registrar
const createProgram = async (req, res) => {
    try {
        const program = await Program.create(req.body);
        res.status(201).json(program);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate a batch of vouchers
// @route   POST /api/admin/vouchers/generate
// @access  Private/Admin
const generateVouchers = async (req, res) => {
    const { count, type, price } = req.body;

    try {
        const vouchers = [];
        for (let i = 0; i < count; i++) {
            vouchers.push({
                serialNumber: 'SN' + crypto.randomInt(100000000, 999999999).toString(),
                pin: crypto.randomInt(100000, 999999).toString(),
                type: type || 'Undergraduate',
                price: price || 100.00,
                status: 'Unsold'
            });
        }
        await Voucher.bulkCreate(vouchers);
        res.status(201).json({ message: `${count} vouchers generated successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admit an applicant
// @route   POST /api/admin/admission/admit/:id
// @access  Private/Admin/Registrar
const admitApplicant = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                { model: User },
                { model: Program, as: 'firstChoice' },
                { model: Program, as: 'secondChoice' },
                { model: Program, as: 'thirdChoice' }
            ]
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const { Role } = require('../models');

        // Get Settings for Prefix
        const settingsList = await Setting.findAll();
        const settings = {};
        settingsList.forEach(s => settings[s.key] = s.value);
        const schoolPrefix = settings.schoolAbbreviation || 'GUMS';

        // 1. Generate Student ID
        const currentYear = new Date().getFullYear();
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);

        const programCode = application.firstChoice ? application.firstChoice.code : 'GEN';
        const systemId = `${schoolPrefix}${currentYear}${programCode}${randomSuffix}`.toUpperCase().replace(/\s/g, '');

        // 2. Change Role to Student
        const studentRole = await Role.findOne({ where: { name: 'student' } });
        if (!studentRole) {
            return res.status(500).json({ message: 'Student role not found' });
        }

        // 3. Update User
        const user = await User.findByPk(application.userId);
        user.roleId = studentRole.id;
        user.systemId = systemId;
        user.admittedProgramId = application.firstChoiceId; // Defaulting to first choice
        await user.save();

        const pdfPath = await generateAdmissionLetter(application.User, application.firstChoice, application, settings);

        // Update application status
        application.status = 'Admitted';
        application.admissionLetter = `/uploads/admission_letters/${application.id}.pdf`;
        application.admittedProgramId = application.firstChoiceId;
        await application.save();

        // Send Email
        const admittedProgramName = application.firstChoice ? application.firstChoice.name : 'your program';
        await sendAdmissionEmail(application.User.email, user, admittedProgramName, pdfPath, settings);

        // Send SMS
        await sendAdmissionSMS(user.phoneNumber, user, admittedProgramName, settings.schoolAbbreviation);

        res.json({ message: 'Applicant admitted and letter generated', application, systemId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
const getApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            include: [
                { model: User },
                { model: Program, as: 'firstChoice' },
                { model: Program, as: 'secondChoice' },
                { model: Program, as: 'thirdChoice' }

            ]
        });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProgram = async (req, res) => {
    try {
        const program = await Program.findByPk(req.params.id);
        if (!program) return res.status(404).json({ message: 'Program not found' });
        await program.update(req.body);
        res.json(program);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProgram = async (req, res) => {
    try {
        const program = await Program.findByPk(req.params.id);
        if (!program) return res.status(404).json({ message: 'Program not found' });
        await program.destroy();
        res.json({ message: 'Program deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPrograms = async (req, res) => {
    try {
        const programs = await Program.findAll();
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Grading Scheme Management ---

const getGradingSchemes = async (req, res) => {
    try {
        const schemes = await GradingScheme.findAll({
            order: [['minScore', 'DESC']]
        });

        // Explicitly ensuring 200 status and array response
        return res.status(200).json(schemes || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGradingScheme = async (req, res) => {
    try {
        const scheme = await GradingScheme.create(req.body);
        res.status(201).json(scheme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGradingScheme = async (req, res) => {
    try {
        const scheme = await GradingScheme.findByPk(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Grading scheme not found' });
        await scheme.update(req.body);
        res.json(scheme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGradingScheme = async (req, res) => {
    try {
        const scheme = await GradingScheme.findByPk(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Grading scheme not found' });
        await scheme.destroy();
        res.json({ message: 'Grading scheme deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Course Management ---

// @desc    Add a new course to a program
// @route   POST /api/admin/courses
// @access  Private/Admin/Registrar
const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses for a program
// @route   GET /api/admin/courses/program/:programId
// @access  Private/Admin/Registrar/Staff
const getCoursesByProgram = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { programId: req.params.programId },
            include: [{
                model: User,
                as: 'instructor',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin/Registrar
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        await course.destroy();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all staff members
// @route   GET /api/admin/staff
// @access  Private/Admin/Registrar
const getStaffMembers = async (req, res) => {
    try {
        const staffRole = await Role.findOne({ where: { name: 'staff' } });
        if (!staffRole) return res.json([]);

        const staff = await User.findAll({
            where: { roleId: staffRole.id },
            attributes: { exclude: ['password'] }
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin/Registrar
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        await course.update(req.body);
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new user (Staff/Admin/Registrar)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { username, email, password, firstName, lastName, role } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Find Role
        const roleRecord = await Role.findOne({ where: { name: role } });
        if (!roleRecord) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Generate Staff ID if role is 'staff', 'registrar', or 'admin'
        let systemId = null;
        if (['staff', 'registrar', 'admin'].includes(role)) {
            const year = new Date().getFullYear();
            const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
            // Format: STF-2024-1234
            systemId = `STF-${year}-${random}`;

            // Allow for custom prefixes based on role if needed?
            // if (role === 'registrar') systemId = `REG-${year}-${random}`;
            // if (role === 'admin') systemId = `ADM-${year}-${random}`;
        }

        // Create User
        const user = await User.create({
            username,
            email,
            password,
            firstName,
            lastName,
            roleId: roleRecord.id,
            systemId: systemId // Saving Staff ID in the polymorphic systemId column
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: roleRecord.name,
            staffId: systemId,
            message: `User created successfully. ID: ${systemId}`
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProgram,
    generateVouchers,
    admitApplicant,
    getApplications,
    updateProgram,
    deleteProgram,
    getPrograms,
    getGradingSchemes,
    createGradingScheme,
    updateGradingScheme,
    deleteGradingScheme,
    createCourse,
    getCoursesByProgram,
    deleteCourse,
    getStaffMembers,
    updateCourse,
    createUser
};

