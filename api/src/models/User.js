const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'users_username_unique'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'users_email_unique',
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otherNames: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    placeOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
    },
    religion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hometown: {
        type: DataTypes.STRING,
        allowNull: true
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true
    },
    maritalStatus: {
        type: DataTypes.ENUM('Single', 'Married', 'Other'),
        allowNull: true
    },
    languagesSpoken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    homeAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postalAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    guardianName: {
        type: DataTypes.STRING,
        allowNull: true
    },

    guardianAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    guardianOccupation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    guardianContact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ghanaPostGps: {
        type: DataTypes.STRING,
        allowNull: true
    },
    voucherId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    },
    systemId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    admittedProgramId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }



}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['username'],
            name: 'users_username_unique'
        },
        {
            unique: true,
            fields: ['email'],
            name: 'users_email_unique'
        },
        {
            unique: true,
            fields: ['systemId'],
            name: 'users_systemId_unique'
        }
    ],
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;
