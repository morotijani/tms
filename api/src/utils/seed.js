const { Role, Course, User, Program, Setting, GradingScheme } = require('../models');




const seedRoles = async () => {
    try {
        const roles = [
            { name: 'admin', description: 'System Administrator' },
            { name: 'registrar', description: 'Academic Registrar' },
            { name: 'accountant', description: 'Financial Officer' },
            { name: 'staff', description: 'Lecturer / Staff' },
            { name: 'student', description: 'Enrolled Student' },
            { name: 'applicant', description: 'Prospective Student' }
        ];

        for (const role of roles) {
            await Role.findOrCreate({
                where: { name: role.name },
                defaults: role
            });
        }
        console.log('Roles seeded successfully.');
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

const seedCourses = async () => {
    try {
        const courses = [
            { code: 'CS101', name: 'Introduction to Computing', creditHours: 3, level: 100, semester: 1 },
            { code: 'CS102', name: 'Digital Logic', creditHours: 3, level: 100, semester: 1 },
            { code: 'MATH101', name: 'Algebra & Calculus', creditHours: 3, level: 100, semester: 1 },
            { code: 'ENG101', name: 'Communication Skills', creditHours: 2, level: 100, semester: 1 },
            { code: 'CS201', name: 'Data Structures', creditHours: 3, level: 200, semester: 1 },
            { code: 'CS202', name: 'Computer Architecture', creditHours: 3, level: 200, semester: 1 }
        ];

        for (const course of courses) {
            await Course.findOrCreate({
                where: { code: course.code },
                defaults: course
            });
        }
        console.log('Courses seeded successfully.');
    } catch (error) {
        console.error('Error seeding courses:', error);
    }
};

const seedUsers = async () => {
    try {
        const users = [
            {
                username: 'admin',
                email: 'admin@gums.edu.gh',
                password: 'admin123',
                firstName: 'System',
                lastName: 'Admin',
                role: 'admin'
            },
            {
                username: 'registrar',
                email: 'registrar@gums.edu.gh',
                password: 'registrar123',
                firstName: 'Academic',
                lastName: 'Registrar',
                role: 'registrar'
            },
            {
                username: 'accountant',
                email: 'accountant@gums.edu.gh',
                password: 'accountant123',
                firstName: 'Chief',
                lastName: 'Accountant',
                role: 'accountant'
            },
            {
                username: 'staff',
                email: 'staff@gums.edu.gh',
                password: 'staff123',
                firstName: 'Kwame',
                lastName: 'Mensah',
                role: 'staff'
            }
        ];

        for (const userData of users) {
            const { role, ...details } = userData;
            const existingUser = await User.findOne({ where: { email: details.email } });

            if (!existingUser) {
                const user = await User.create(details);
                const roleObj = await Role.findOne({ where: { name: role } });
                if (roleObj) {
                    await user.setRole(roleObj);
                }
            }
        }
        console.log('Test users seeded successfully.');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

const seedPrograms = async () => {
    try {
        const programs = [
            // Undergraduate
            // { name: 'BSc. Computer Science', code: 'BCS', faculty: 'Science & Technology', department: 'Computer Science', level: 'Undergraduate', duration: 4 },
            // { name: 'BSc. Information Technology', code: 'BIT', faculty: 'Science & Technology', department: 'Information Technology', level: 'Undergraduate', duration: 4 },
            // { name: 'BSc. Business Administration', code: 'BBA', faculty: 'Business School', department: 'Management', level: 'Undergraduate', duration: 4 },
            // { name: 'BSc. Accounting', code: 'BACC', faculty: 'Business School', department: 'Accounting', level: 'Undergraduate', duration: 4 },

            // // Postgraduate
            // { name: 'MSc. Cyber Security', code: 'MCS', faculty: 'Science & Technology', department: 'Computer Science', level: 'Postgraduate', duration: 2 },
            // { name: 'MBA Strategic Management', code: 'MBA', faculty: 'Business School', department: 'Management', level: 'Postgraduate', duration: 2 },

            // // Diploma / Mature
            // { name: 'Diploma in Information Technology', code: 'DIT', faculty: 'Science & Technology', department: 'Information Technology', level: 'Diploma', duration: 2 },
            // { name: 'Diploma in Business Management', code: 'DBM', faculty: 'Business School', department: 'Management', level: 'Diploma', duration: 2 }
        ];

        for (const prog of programs) {
            await Program.findOrCreate({
                where: { code: prog.code },
                defaults: prog
            });
        }
        console.log('Programs seeded successfully.');
    } catch (error) {
        console.error('Error seeding programs:', error);
    }
};

const seedSettings = async () => {
    try {
        const settings = [
            { key: 'schoolName', value: 'Ghana University Management System', type: 'text' },
            { key: 'schoolAbbreviation', value: 'GUMS', type: 'text' },
            { key: 'schoolAddress', value: '123 University Avenue, Accra, Ghana', type: 'text' },
            { key: 'schoolLogo', value: '', type: 'image' },
            { key: 'schoolEmail', value: 'info@gums.edu.gh', type: 'text' },
            { key: 'schoolPhone', value: '+233 123 456 789', type: 'text' }
        ];

        for (const setting of settings) {
            await Setting.findOrCreate({
                where: { key: setting.key },
                defaults: setting
            });
        }
        console.log('Settings seeded successfully.');
    } catch (error) {
        console.error('Error seeding settings:', error);
    }
};

const seedGradingSchemes = async () => {
    try {
        const schemes = [
            { name: 'WASSCE', grade: 'A1', minScore: 75, maxScore: 100, point: 1, description: 'Excellent' },
            { name: 'WASSCE', grade: 'B2', minScore: 70, maxScore: 74, point: 2, description: 'Very Good' },
            { name: 'WASSCE', grade: 'B3', minScore: 65, maxScore: 69, point: 3, description: 'Good' },
            { name: 'WASSCE', grade: 'C4', minScore: 60, maxScore: 64, point: 4, description: 'Credit' },
            { name: 'WASSCE', grade: 'C5', minScore: 55, maxScore: 59, point: 5, description: 'Credit' },
            { name: 'WASSCE', grade: 'C6', minScore: 50, maxScore: 54, point: 6, description: 'Credit' },
            { name: 'WASSCE', grade: 'D7', minScore: 45, maxScore: 49, point: 7, description: 'Pass' },
            { name: 'WASSCE', grade: 'E8', minScore: 40, maxScore: 44, point: 8, description: 'Pass' },
            { name: 'WASSCE', grade: 'F9', minScore: 0, maxScore: 39, point: 9, description: 'Fail' }
        ];

        for (const scheme of schemes) {
            await GradingScheme.findOrCreate({
                where: { name: scheme.name, grade: scheme.grade },
                defaults: scheme
            });
        }
        console.log('Grading schemes seeded successfully.');
    } catch (error) {
        console.error('Error seeding grading schemes:', error);
    }
};

module.exports = { seedRoles, seedCourses, seedUsers, seedPrograms, seedSettings, seedGradingSchemes };



