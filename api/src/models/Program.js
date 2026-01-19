const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Program = sequelize.define('Program', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    faculty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.ENUM('Undergraduate', 'Postgraduate', 'Diploma', 'Certificate'),
        defaultValue: 'Undergraduate'
    },
    duration: {
        type: DataTypes.INTEGER, // in years
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    }
}, {
    timestamps: true
});

module.exports = Program;
