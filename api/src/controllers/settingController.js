const { Setting } = require('../models');

// Get all settings (Public)
exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });
        res.json(settingsObj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update settings (Admin)
exports.updateSettings = async (req, res) => {
    try {
        const settings = req.body; // Expecting { schoolName: '...', logo: '...' }

        for (const [key, value] of Object.entries(settings)) {
            await Setting.upsert({ key, value });
        }

        const updatedSettings = await Setting.findAll();
        const settingsObj = {};
        updatedSettings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        res.json({ message: 'Settings updated successfully', settings: settingsObj });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Handle Logo Upload
exports.uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const logoUrl = `/uploads/${req.file.filename}`;
        await Setting.upsert({ key: 'schoolLogo', value: logoUrl, type: 'image' });

        res.json({ message: 'Logo uploaded successfully', logoUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
