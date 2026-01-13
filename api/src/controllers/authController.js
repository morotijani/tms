const jwt = require('jsonwebtoken');
const { User, Role, Voucher } = require('../models');

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
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, attributes: ['name'] }]
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.Role.name,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerApplicant,
    login
};
