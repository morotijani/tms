const { Role, Course } = require('../models');

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

module.exports = { seedRoles, seedCourses };
