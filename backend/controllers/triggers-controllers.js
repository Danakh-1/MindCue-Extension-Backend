const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Trigger = require('../models/Trigger-user-choice.js');

const getTriggers = async (req, res, next) => {
  let triggers;
  try {
    triggers = await Trigger.find({}, '');
  } catch (err) {
    const error = new HttpError(
      'Fetching triggers failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({triggers: triggers.map(trigger => trigger.toObject({ getters: true }))});
};

const addTrigger = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name } = req.body;
  
  // TODO: Attach the userId from the token
  // Or, basic authentication: login then retrieve the userId of the logged in user
  const createdTrigger = new Trigger({
    name
  });
  
  try {
    await createdTrigger.save();
  } catch (err) {
    const error = new HttpError(
      'Adding a trigger failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({trigger: createdTrigger.toObject({ getters: true })});
};

exports.getTriggers = getTriggers;
exports.addTrigger = addTrigger;
