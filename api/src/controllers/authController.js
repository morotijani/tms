const jwt = require('jsonwebtoken');
const { User, Role, Voucher, Setting } = require('../models');
const { sendPasswordResetEmail } = require('../utils/mail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new applicant using a voucher
// @route   POST /api/auth/register-applicant
// @access  Public
const registerApplicant = async (req, res) => {
    const { username, email, password, firstName, lastName, serialNumber, pin } = req.body;

    try {
        // 1. Verify Voucher
        const voucher = await Voucher.findOne({ where: { serialNumber, pin, status: 'Sold' } });
        if (!voucher) {
            return res.status(400).json({ message: 'Invalid or already used voucher' });
        }

        // 2. Check if user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Get Applicant Role
        const applicantRole = await Role.findOne({ where: { name: 'applicant' } });

        // 4. Create User
        const user = await User.create({
            username,
            email,
            password, // Hook will hash this
            firstName,
            lastName,
            roleId: applicantRole.id,
            voucherId: voucher.id
        });


        // 5. Update Voucher status
        voucher.status = 'Used';
        voucher.usedAt = new Date();
        await voucher.save();

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: 'applicant',
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body; // 'email' field in body might contain Student ID

    try {
        const { Op } = require('sequelize');

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { systemId: email }
                ]
            },
            include: [{ model: Role, attributes: ['name'] }]
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.Role.name,
                systemId: user.systemId, // Send back system ID
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const { Op } = require('sequelize');
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: email }, { systemId: email }]
            }
        });

        if (!user) {
            // We return 200 even if user not found to prevent email enumeration
            return res.status(200).json({ message: 'If that email or ID exists, a reset link has been sent.' });
        }

        // Secret consists of the valid JWT_SECRET and the user's current password hash.
        // This ensures the token becomes invalid once the password is changed.
        const secret = process.env.JWT_SECRET + user.password;
        
        const payload = {
            email: user.email,
            id: user.id
        };

        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        
        // Use FRONTEND_URL from env or fallback to a default
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${user.id}/${token}`;

        // Fetch Settings for Email
        const settingsList = await Setting.findAll();
        const settings = {};
        settingsList.forEach(s => settings[s.key] = s.value);

        await sendPasswordResetEmail(user.email, resetUrl, settings);

        res.status(200).json({ message: 'If that email or ID exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { id, token, newPassword } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const secret = process.env.JWT_SECRET + user.password;
        
        try {
            jwt.verify(token, secret);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Token is valid, update password
        user.password = newPassword; // the beforeUpdate hook will hash it
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerApplicant,
    login,
    forgotPassword,
    resetPassword
};
