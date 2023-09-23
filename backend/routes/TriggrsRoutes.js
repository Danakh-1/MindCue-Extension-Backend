const express = require('express');
const router = express.Router();
const triggersController = require('../controllers/triggers-controllers');


// Display the form page
router.get('/', triggersController.displayForm);

// Handle form submission
router.post('/process-form', triggersController.processForm);

module.exports = router;


