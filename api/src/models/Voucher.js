const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Voucher = sequelize.define('Voucher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    serialNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    pin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Sold', 'Unsold', 'Used', 'Expired'),
        defaultValue: 'Unsold'
    },
    type: {
        type: DataTypes.ENUM('Undergraduate', 'Postgraduate', 'International'),
        defaultValue: 'Undergraduate'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    soldAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    usedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    transactionId: {
        type: DataTypes.STRING, // Paystack ref
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Voucher;
