const express = require('express');
const router = express.Router();
const Timer = require('../models/timer');

// Route to save timer values
router.post('/save', async (req, res) => {
  const { hours, minutes, seconds } = req.body;

  try {
    // Create a new timer document
    const timer = new Timer({ hours, minutes, seconds });
    // Save the timer document to MongoDB
    await timer.save();
    res.status(201).json({ message: 'Timer values saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
