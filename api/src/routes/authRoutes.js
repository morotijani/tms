const express = require('express');
const router = express.Router();
const { login, registerApplicant } = require('../controllers/authController');

router.post('/login', login);
router.post('/register-applicant', registerApplicant);

module.exports = router;
