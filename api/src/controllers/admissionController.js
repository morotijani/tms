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
        // Personal Details (to User model)
        firstName, lastName, otherNames, phoneNumber, gender, dateOfBirth,
        placeOfBirth, religion, hometown, district, region, maritalStatus,
        languagesSpoken, homeAddress, postalAddress, guardianName, guardianAddress, guardianOccupation,
        guardianContact, ghanaPostGps,

        // Application Details (to Application model)
        firstChoiceId, secondChoiceId, thirdChoiceId,
        secondarySchoolName, secondarySchoolAddress, secondarySchoolStartYear, secondarySchoolEndYear,
        results, refereeName, refereeAddress, refereeContact,
        examType, indexNumber, examYear
    } = req.body;



    try {
        // 1. Update User Profile
        await User.update({
            firstName, lastName, otherNames, phoneNumber, gender, dateOfBirth,
            placeOfBirth, religion, hometown, district, region, maritalStatus,
            languagesSpoken, homeAddress, postalAddress, guardianName, guardianAddress, guardianOccupation,
            guardianContact, ghanaPostGps

        }, { where: { id: req.user.id } });


        // 2. Create or Update Application
        let application = await Application.findOne({ where: { userId: req.user.id } });

        const appData = {
            userId: req.user.id,
            firstChoiceId,
            secondChoiceId,
            thirdChoiceId,
            secondarySchoolName,
            secondarySchoolAddress,
            secondarySchoolStartYear,
            secondarySchoolEndYear,
            results,
            refereeName,
            refereeAddress,
            refereeContact,
            examType,
            indexNumber,
            examYear,
            voucherId: req.user.voucherId,
            status: req.body.status || 'Draft'
        };





        if (application) {
            await application.update(appData);
        } else {
            application = await Application.create(appData);
        }

        // Re-fetch with associations for the frontend
        const fullApplication = await Application.findOne({
            where: { id: application.id },
            include: [
                { model: User },
                { model: Program, as: 'firstChoice' },
                { model: Program, as: 'secondChoice' },
                { model: Program, as: 'thirdChoice' }
            ]
        });

        res.status(200).json({ message: 'Application saved successfully', application: fullApplication });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload application documents
// @route   POST /api/admission/upload
// @access  Private/Applicant
const uploadDocuments = async (req, res) => {
    try {
        const application = await Application.findOne({ where: { userId: req.user.id } });
        if (!application) {
            return res.status(404).json({ message: 'Application not found. Please fill the bio-data first.' });
        }

        const updates = {};
        if (req.files['resultSlip']) updates.resultSlip = `/uploads/${req.files['resultSlip'][0].filename}`;
        if (req.files['resultSlip2']) updates.resultSlip2 = `/uploads/${req.files['resultSlip2'][0].filename}`;
        if (req.files['resultSlip3']) updates.resultSlip3 = `/uploads/${req.files['resultSlip3'][0].filename}`;
        if (req.files['birthCertificate']) updates.birthCertificate = `/uploads/${req.files['birthCertificate'][0].filename}`;
        if (req.files['transcript']) updates.transcript = `/uploads/${req.files['transcript'][0].filename}`;
        if (req.files['passportPhoto']) updates.passportPhoto = `/uploads/${req.files['passportPhoto'][0].filename}`;


        await application.update(updates);

        res.json({ message: 'Documents uploaded successfully', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get current user's application
// @route   GET /api/admission/my-application
// @access  Private/Applicant
const getMyApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            where: { userId: req.user.id },
            include: [
                { model: User },
                { model: Program, as: 'firstChoice' },
                { model: Program, as: 'secondChoice' },
                { model: Program, as: 'thirdChoice' }
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

