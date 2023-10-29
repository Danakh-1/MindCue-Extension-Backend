const express = require('express');
const { getTriggers, addTrigger } = require('../controllers/triggers-controllers');

const router = express.Router();

// Define API routes
router.get('/triggers', getTriggers);
router.post('/add-trigger', addTrigger);
//router.post('/user-terms', addUserTerm);

module.exports = router;