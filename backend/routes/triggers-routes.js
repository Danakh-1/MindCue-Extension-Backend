const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersController.getTriggers);
 
router.post('/addTrigger', usersController.addTrigger);

module.exports = router;
