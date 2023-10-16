// const express = require('express');
// const router = express.Router();
// const UserSelection = require('../models/UserSelection');

// // Route to save user selection
// router.post('/save', async (req, res) => {
//   const { selectedOption } = req.body;
//   try {
//     // Create a new user selection document
//     const userSelection = new UserSelection({ selectedOption });
//     // Save the user selection document to MongoDB
//     await userSelection.save();
//     res.status(201).json({ message: 'User selection saved successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server Error' });
//   }
// });

// module.exports = router;


// // const express = require('express');
// // const router = express.Router();
// // const triggersController = require('../controllers/triggers-controllers');


// // // Display the form page
// // router.get('/', triggersController.displayForm);

// // // Handle form submission
// // router.post('/process-form', triggersController.processForm);

// // module.exports = router;

// // const express = require('express');
// // const router = express.Router();
// // const settingsController = require('../controllers/settings-controllers');

// // // POST request to save selected option
// // router.post('/submit-settings', settingsController.saveSelectedOption);

// // module.exports = router;


