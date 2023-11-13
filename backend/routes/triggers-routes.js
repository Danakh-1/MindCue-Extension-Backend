const express = require('express');
const { check } = require('express-validator');

const triggersController = require('../controllers/triggers-controllers');

const router = express.Router();

router.get('/:userId', triggersController.getTriggers);
router.get('/:id', triggersController.getTriggerById);
 
router.post('/addTrigger', [
    check('name')
      .not()
      .isEmpty(),
    check('userId')
      .not()
      .isEmpty()
  ],triggersController.addTrigger);

router.put('/updateTrigger/:id', [
    check('name')
      .not()
      .isEmpty()
  ],triggersController.updateTrigger);

router.delete('/:id', triggersController.deleteTrigger);

module.exports = router;
