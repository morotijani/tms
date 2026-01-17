const { Application, User, Program, Voucher, Setting } = require('../models');
const crypto = require('crypto');
const { generateAdmissionLetter } = require('../utils/pdfGenerator');

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
        const studentId = `${schoolPrefix}${currentYear}${programCode}${randomSuffix}`.toUpperCase().replace(/\s/g, '');

        // 2. Change Role to Student
        const studentRole = await Role.findOne({ where: { name: 'student' } });
        if (!studentRole) {
            return res.status(500).json({ message: 'Student role not found' });
        }

        // 3. Update User
        const user = await User.findByPk(application.userId);
        user.roleId = studentRole.id;
        user.studentId = studentId;
        user.admittedProgramId = application.firstChoiceId; // Defaulting to first choice
        await user.save();

        const pdfPath = await generateAdmissionLetter(application.User, application.firstChoice, application.id, settings);
        // Note: In registrarController, I saw `generateAdmissionLetter(user, program, application.id, settings)`. 
        // The adminController one was `generateAdmissionLetter(application.User, application.firstChoice, application.id)`. 
        // I should probably pass settings here too if the util expects it, but let's stick to just fixing the ID first unless I see the util code.
        // Wait, registrarController passed settings. adminController logic was:
        // const pdfPath = await generateAdmissionLetter(application.User, application.firstChoice, application.id);

        // Let's assume generateAdmissionLetter signature is flexible or I should check it. 
        // Checking registrarController again... it was: `generateAdmissionLetter(user, program, application.id, settings);`
        // So I should probably update this call to match if I can.

        // Update application status
        application.status = 'Admitted';
        application.admissionLetter = `/uploads/admission_letters/${application.id}.pdf`;
        application.admittedProgramId = application.firstChoiceId;
        await application.save();

        res.json({ message: 'Applicant admitted and letter generated', application, studentId });
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

module.exports = {
    createProgram,
    generateVouchers,
    admitApplicant,
    getApplications
};

