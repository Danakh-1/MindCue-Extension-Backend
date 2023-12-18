// routes/userInputRoutes.js
const express = require('express');
const router = express.Router();
const browsingData = require('../controllers/browsingData-Controller');
const upload = require('../middleware/multer');
const { ensureToken } = require('../services/secure');

// Endpoint to handle user input
router.post(
	'/userInput',
	ensureToken,
	upload.single('file'),
	browsingData.saveUserInput
);

router.get('/userInput', ensureToken, browsingData.getUserInput);

module.exports = router;
