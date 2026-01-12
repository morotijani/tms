const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creditHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3
    },
    semester: {
        type: DataTypes.INTEGER, // 1 or 2
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER, // 100, 200, 300, 400
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Course;
