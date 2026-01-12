const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    academicYear: {
        type: DataTypes.STRING, // e.g., "2025/2026"
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Registered', 'Dropped', 'Completed'),
        defaultValue: 'Registered'
    },
    // Grading
    caScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    examScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    totalScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    grade: {
        type: DataTypes.STRING(2),
        allowNull: true
    },
    gradePoint: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Enrollment;
