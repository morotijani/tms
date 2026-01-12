const { Application, Program, User } = require('../models');

// @desc    Get all available programs
// @route   GET /api/admission/programs
// @access  Public
const getPrograms = async (req, res) => {
    try {
        const programs = await Program.findAll();
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit application form
// @route   POST /api/admission/apply
// @access  Private/Applicant
const submitApplication = async (req, res) => {
    const {
        firstName, lastName, otherNames, phoneNumber, gender, dateOfBirth, ghanaPostGps,
        firstChoiceId, secondChoiceId, examType, indexNumber, examYear
    } = req.body;

    try {
        // 1. Update User Profile
        await User.update({
            firstName, lastName, otherNames, phoneNumber, gender, dateOfBirth, ghanaPostGps
        }, { where: { id: req.user.id } });

        // 2. Create or Update Application
        let application = await Application.findOne({ where: { userId: req.user.id } });

        const appData = {
            userId: req.user.id,
            firstChoiceId,
            secondChoiceId,
            examType,
            indexNumber,
            examYear,
            status: 'Submitted'
        };

        if (application) {
            await application.update(appData);
        } else {
            application = await Application.create(appData);
        }

        res.status(200).json({ message: 'Application submitted successfully', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload application documents
// @route   POST /api/admission/upload
// @access  Private/Applicant
const uploadDocuments = async (req, res) => {
    // ...
};

// @desc    Get current user's application
// @route   GET /api/admission/my-application
// @access  Private/Applicant
const getMyApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            where: { userId: req.user.id },
            include: [
                { model: Program, as: 'firstChoice' },
                { model: Program, as: 'secondChoice' }
            ]
        });
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPrograms,
    submitApplication,
    uploadDocuments,
    getMyApplication
};

