const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Fee', 'Voucher', 'Other'),
        defaultValue: 'Fee'
    },
    method: {
        type: DataTypes.ENUM('MoMo', 'Card', 'Bank Deposit'),
        allowNull: false
    },
    reference: {
        type: DataTypes.STRING, // Paystack ref
        unique: true,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Success', 'Failed'),
        defaultValue: 'Pending'
    },
    paidAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Payment;
