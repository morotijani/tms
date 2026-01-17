const { Op } = require('sequelize');
const { Application, User, Program, Setting } = require('../models');
const { generateAdmissionLetter } = require('../utils/pdfGenerator');
const path = require('path');


// @desc    Get all submitted/processed applications
// @route   GET /api/registrar/applications
// @access  Private/Registrar
const getSubmittedApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: {
                status: { [Op.in]: ['Submitted', 'Admitted'] }
            },

            include: [
                { model: User },
                { model: Program, as: 'firstChoice' },
                { model: Program, as: 'secondChoice' },
                { model: Program, as: 'thirdChoice' }
            ],
            order: [['updatedAt', 'DESC']]
        });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (Admit/Reject)
// @route   PATCH /api/registrar/applications/:id/status
// @access  Private/Registrar
const updateApplicationStatus = async (req, res) => {
    const { status, admissionLetter, admittedProgramId } = req.body;

    try {
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (status === 'Admitted' && admittedProgramId) {
            const program = await Program.findByPk(admittedProgramId);
            const user = await User.findByPk(application.userId);

            // Get current school settings for the letter
            const settingsList = await Setting.findAll();
            const settings = {};
            settingsList.forEach(s => settings[s.key] = s.value);

            const pdfPath = await generateAdmissionLetter(user, program, application.id, settings);

            // Convert absolute path to relative for public access
            application.admissionLetter = `/uploads/admission_letters/${application.id}.pdf`;
            application.admittedProgramId = admittedProgramId;
        }

        application.status = status;

        await application.save();



        res.json({ message: `Application status updated to ${status}`, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSubmittedApplications,
    updateApplicationStatus
};
