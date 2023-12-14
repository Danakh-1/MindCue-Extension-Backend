// routes/userInputRoutes.js
const express = require('express');
const router = express.Router();
const browsingData = require('../controllers/browsingData-Controller');

// Endpoint to handle user input
router.post('/userInput', browsingData.saveUserInput);

module.exports = router;
