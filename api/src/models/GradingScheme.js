const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GradingScheme = sequelize.define('GradingScheme', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING, // e.g., "Standard 4.0", "GTEC 5.0"
        allowNull: false
    },
    minScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    maxScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    grade: {
        type: DataTypes.STRING(2), // A, B+, etc.
        allowNull: false
    },
    point: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = GradingScheme;
