const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Submitted', 'Pending', 'Admitted', 'Rejected'),
        defaultValue: 'Draft'
    },
    // WASSCE/SSCE Data
    examType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    indexNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    examYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // Documents (URLs)
    resultSlip: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resultSlip2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resultSlip3: {
        type: DataTypes.STRING,
        allowNull: true
    },

    birthCertificate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transcript: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admissionLetter: {
        type: DataTypes.STRING, // Path to generated PDF
        allowNull: true
    },
    // Educational Background
    secondarySchoolName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    secondarySchoolAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    secondarySchoolStartYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    secondarySchoolEndYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    // Results (Stored as JSON object containing multiple sittings/subjects)
    results: {
        type: DataTypes.JSON,
        allowNull: true
    },
    // Referee Info
    refereeName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refereeAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    refereeContact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Media
    passportPhoto: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    timestamps: true
});

module.exports = Application;
