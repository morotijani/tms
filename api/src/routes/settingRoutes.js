const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getPublicSettings, updateSettings, uploadLogo } = require('../controllers/settingController');

// Public route
router.get('/', getPublicSettings);

// Admin routes
router.post('/', protect, authorize('admin'), updateSettings);
router.post('/logo', protect, authorize('admin'), upload.single('logo'), uploadLogo);

module.exports = router;
