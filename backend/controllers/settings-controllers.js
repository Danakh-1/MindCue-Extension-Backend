const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Setting = require('../models/settings.js');

// How to retrieve user's data from jwt token
// const saveGeneralSettings = async (req, res, next) => {
//   let generalSettings;
//   try {
//     const { userId, selectedCheckBoxes } = req.body;
//     console.log(req?.body)
//     generalSettings = await Setting.updateOne({user: userId}, {checkboxValues: selectedCheckBoxes}, {new: true});
//     console.log(generalSettings);
//     res.status(200).json(generalSettings);
//   } catch(err) {
//     console.log(err)
//     console.log('test');
//   }
// };

const saveGeneralSettings = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find the setting document for the user or create if it doesn't exist
    let setting = await Setting.findOne({ user: userId });
    console.log(req.body)

    console.log("check boxes",req?.body?.selectedCheckboxes)
    
    if (!setting) {
      setting = new Setting({ user: userId });
    }
    // Update the checkbox valuescheckboxValues
    setting.checkboxValues = req?.body?.selectedCheckboxes;
    // Save the changes to the document
    await setting.save();

    res.status(200).json({ message: 'General settings saved successfully', 
    data:  setting
   });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving general settings' });
  }
};

const saveWarningSettings = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find the setting document for the user or create if it doesn't exist
    let setting = await Setting.findOne({ user: userId });
    console.log(req.body)

    console.log("radioButtonValue",req?.body?.selectedRadio)
    
    if (!setting) {
      setting = new Setting({ user: userId });
    }
    // Update the checkbox valuescheckboxValues
    setting.radioButtonValue = req?.body?.selectedRadio;
    // Save the changes to the document
    await setting.save();

    res.status(200).json({ message: 'warning settings saved successfully', 
    data:  setting
   });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving warning settings' });
  }
};



const getSettings = async (req, res, next) => {
  let settings;
  try {
    const { userId } = req.params;
    settings = await Setting.find({ user: userId }).populate('user');
  } catch (err) {
    const error = new HttpError(
      'Fetching settings failed, please try again later.',
      500
    );

    return next(error);
  }
  res.json({ settings: settings.map(setting => setting.toObject({ getters: true })) });
};

const getSettingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new HttpError(
        'Invalid input',
        404
      );
      return next(error);
    }

    const setting = await Setting.findById({ _id: id }).populate('user');
    res.status(200).json({ setting });

  } catch (err) {
    const error = new HttpError(
      'Fetching settings failed, please try again later.',
      500
    );
    return next(error);
  }
};

const addSetting = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, userId } = req.body;
  const createdSetting = new Setting({
    name,
    user: userId
  });

  try {
    await createdSetting.save();
  } catch (err) {
    const error = new HttpError(
      'Adding a setting failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ setting: createdSetting.toObject({ getters: true }) });
};

const updateSetting = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { id } = req.params;

  if (!id) {
    const error = new HttpError(
      'Invalid input',
      404
    );
    return next(error);
  }

  try {
    const updatedSetting = await Setting.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    res.status(200).json({ updatedSetting });
  } catch (err) {
    const error = new HttpError(
      'Updating a setting failed, please try again.',
      500
    );
    return next(error);
  }
};

const deleteSetting = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new HttpError(
        'Invalid input',
        404
      );
      return next(error);
    }

    const setting = await Setting.findByIdAndDelete(id);
    res.status(200).json({ message: "Setting deleted successfully" });

  } catch (err) {
    const error = new HttpError(
      'Deleting settings failed, please try again later.',
      500
    );
    return next(error);
  }
};

exports.getSettings = getSettings;
exports.getSettingById = getSettingById;
exports.addSetting = addSetting;
exports.updateSetting = updateSetting;
exports.deleteSetting = deleteSetting;
exports.saveGeneralSettings = saveGeneralSettings;
exports.saveWarningSettings = saveWarningSettings;
// 


