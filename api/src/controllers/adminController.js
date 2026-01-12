const { Application, User, Program, Voucher } = require('../models');
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
                { model: Program, as: 'firstChoice' }
            ]
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const pdfPath = await generateAdmissionLetter(application.User, application.firstChoice, application.id);

        // Update application status
        application.status = 'Admitted';
        application.admissionLetter = `/uploads/admission_letters/${application.id}.pdf`;
        await application.save();

        res.json({ message: 'Applicant admitted and letter generated', application });
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
                { model: Program, as: 'firstChoice' }
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

