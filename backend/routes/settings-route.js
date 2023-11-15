const express = require('express');
const { check } = require('express-validator');

const settingsController = require('../controllers/settings-controllers');

const router = express.Router();

router.get('/:userId', settingsController.getSettings);
router.get('/:id', settingsController.getSettingById);
router.post('/saveGeneralSettings', settingsController.saveGeneralSettings);
router.post('/addSetting', [
  check('name').not().isEmpty(),
  check('userId').not().isEmpty()
], settingsController.addSetting);

router.put('/updateSetting/:id', [
  check('name').not().isEmpty()
], settingsController.updateSetting);

router.delete('/:id', settingsController.deleteSetting);

module.exports = router;


// const express = require('express');
// const Settings = require('../models/settings'); // Import your MongoDB model

// router.post('/settings', async (req, res) => {
//     try {
//         // Extract settings data from the request body
//         const { checkboxValues, radioButtonValue } = req.body;

//         // Save the data to MongoDB using your model
//         const savedSettings = await Settings.create({
//             checkboxValues,
//             radioButtonValue,
//         });

//         res.json({ message: 'Settings saved successfully', savedSettings });
//     } catch (error) {
//         console.error('Error saving settings:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// module.exports = router;