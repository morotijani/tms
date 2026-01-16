const { sequelize } = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Program = require('./Program');
const Voucher = require('./Voucher');
const Application = require('./Application');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Invoice = require('./Invoice');
const Payment = require('./Payment');
const Resource = require('./Resource');
const Attendance = require('./Attendance');
const GradingScheme = require('./GradingScheme');

// Associations


User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

// Program and Course
Program.hasMany(Course, { foreignKey: 'programId' });
Course.belongsTo(Program, { foreignKey: 'programId' });

// Enrollment (Student <-> Course)
User.hasMany(Enrollment, { foreignKey: 'userId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });

Course.hasMany(Enrollment, { foreignKey: 'courseId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

// Financials
User.hasMany(Invoice, { foreignKey: 'userId' });
Invoice.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Invoice.hasMany(Payment, { foreignKey: 'invoiceId' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId' });

// Course and Resources
Course.hasMany(Resource, { foreignKey: 'courseId' });
Resource.belongsTo(Course, { foreignKey: 'courseId' });

// Staff (User) and Courses
User.hasMany(Course, { foreignKey: 'instructorId' });
Course.belongsTo(User, { as: 'instructor', foreignKey: 'instructorId' });

// Attendance
User.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

Course.hasMany(Attendance, { foreignKey: 'courseId' });
Attendance.belongsTo(Course, { foreignKey: 'courseId' });

// Application associations

Application.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Application, { foreignKey: 'userId' });

Application.belongsTo(Program, { as: 'firstChoice', foreignKey: 'firstChoiceId' });
Application.belongsTo(Program, { as: 'secondChoice', foreignKey: 'secondChoiceId' });
Application.belongsTo(Program, { as: 'thirdChoice', foreignKey: 'thirdChoiceId' });
Application.belongsTo(Program, { as: 'admittedProgram', foreignKey: 'admittedProgramId' });



Application.belongsTo(Voucher, { foreignKey: 'voucherId' });
Voucher.hasOne(Application, { foreignKey: 'voucherId' });

module.exports = {
    sequelize,
    User,
    Role,
    Program,
    Voucher,
    Application,
    Course,
    Enrollment,
    Invoice,
    Payment,
    Resource,
    Attendance,
    GradingScheme
};




