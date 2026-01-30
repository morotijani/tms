const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/database');
const { seedRoles, seedCourses, seedUsers, seedPrograms, seedSettings } = require('./utils/seed');


dotenv.config();

const app = express();

// Sync database and seed
const startDB = async () => {
    await connectDB();
    if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true }); // Use alter in dev to update schema without dropping data
        await seedRoles();
        await seedCourses();
        await seedUsers();
        await seedPrograms();
        await seedSettings();
        const { seedGradingSchemes } = require('./utils/seed');
        await seedGradingSchemes();
    }

};



startDB();


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const studentRoutes = require('./routes/studentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const financeRoutes = require('./routes/financeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const registrarRoutes = require('./routes/registrarRoutes');
const settingRoutes = require('./routes/settingRoutes');







app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to UMS Ghana API' });
});

// Routes
console.log('Registering /api/auth');
app.use('/api/auth', authRoutes);
console.log('Registering /api/admin');
app.use('/api/admin', adminRoutes);
console.log('Registering /api/admission');
app.use('/api/admission', admissionRoutes);
console.log('Registering /api/student');
app.use('/api/student', studentRoutes);
console.log('Registering /api/staff');
app.use('/api/staff', staffRoutes);
console.log('Registering /api/finance');
app.use('/api/finance', financeRoutes);
console.log('Registering /api/payments');
app.use('/api/payments', paymentRoutes);
console.log('Registering /api/registrar');
app.use('/api/registrar', registrarRoutes);
console.log('Registering /api/settings');
app.use('/api/settings', settingRoutes);











module.exports = app;
