// controllers/userInputController.js

const TrackSession = require('../models/tracksession');

exports.saveUserInput = async (req, res) => {
  const { startTime, endTime, urls } = req.body;
  const userID = req.user.userId;

  try {
    const trackSession = new TrackSession({ userID, startTime, endTime, urls });
    await trackSession.save();
    console.log('User input saved to MongoDB:', { userID, startTime, endTime, urls });
    res.status(200).json({ message: 'User input saved successfully.' });
  } catch (error) {
    console.error('Error saving user input:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
