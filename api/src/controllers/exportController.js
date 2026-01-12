const { User, Application, Role } = require('../models');

// @desc    Export NSS Data for final year students
// @route   GET /api/admin/export/nss
// @access  Private/Admin
const exportNSSData = async (req, res) => {
    try {
        const students = await User.findAll({
            include: [{
                model: Role,
                where: { name: 'student' }
            }],
            attributes: ['firstName', 'lastName', 'email', 'phone', 'gender', 'dob', 'ghanaPostGps']
        });

        // Simple CSV construction
        let csv = 'First Name,Last Name,Email,Phone,Gender,DOB,Ghana Post GPS\n';

        students.forEach(s => {
            csv += `${s.firstName},${s.lastName},${s.email},${s.phone},${s.gender},${s.dob},${s.ghanaPostGps}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=nss_export_' + Date.now() + '.csv');
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { exportNSSData };
