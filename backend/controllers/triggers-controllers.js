const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Trigger = require('../models/Triggers.js');

const getTriggers = async (req, res, next) => {
  let triggers;
  try {
    // const { userId } = req.body;
    const { userId } = req.params
    // triggers = await Trigger.find({}).populate('user');
    // Assuming you have a field named 'user' in your Trigger model
    triggers = await Trigger.find({ user: userId }).populate('user');
  } catch (err) {
    const error = new HttpError(
      'Fetching triggers failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({triggers: triggers.map(trigger => trigger.toObject({ getters: true }))});
};

const getTriggerById = async (req, res, next) => {
  try {
    const { id } = req.params

    if(!id){
      const error = new HttpError(
        'invalid input',
        404
      );
      return next(error);
    }

    const trigger = await Trigger.findById({ _id:id}).populate('user');
    res.status(200).json({trigger})

  } catch (err) {
    const error = new HttpError(
      'Fetching triggers failed, please try again later.',
      500
    );
    return next(error);
  }
};

const addTrigger = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, userId } = req.body;
  // TODO: Attach the userId from the token
  // Or, basic authentication: login then retrieve the userId of the logged in user
  const createdTrigger = new Trigger({
    name,
    user: userId
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

const updateTrigger = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { id } = req.params;

  if(!id){
    const error = new HttpError(
      'invalid input',
      404
    );
    return next(error);
  }

  try {
    const updatedTrigger = await Trigger.findByIdAndUpdate({ _id: id },req.body,{new:true});
    res.status(200).json({updatedTrigger})
  } catch (err) {
    const error = new HttpError(
      'updating a trigger failed, please try again.',
      500
    );
    return next(error);
  }

};

const deleteTrigger = async (req, res, next) => {
  try {
    const { id } = req.params

    if(!id){
      const error = new HttpError(
        'invalid input',
        404
      );
      return next(error);
    }

    const trigger = await Trigger.findByIdAndDelete(id);
    res.status(200).json({message:"tigger deleted successfully"})

  } catch (err) {
    const error = new HttpError(
      'deleting triggers failed, please try again later.',
      500
    );
    return next(error);
  }
};

exports.getTriggers = getTriggers;
exports.getTriggerById = getTriggerById;
exports.addTrigger = addTrigger;
exports.updateTrigger = updateTrigger;
exports.deleteTrigger = deleteTrigger;
