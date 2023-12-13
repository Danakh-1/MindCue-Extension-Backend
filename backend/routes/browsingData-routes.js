const express = require('express');
const router = express.Router();
const Track = require('../models/tracksession'); // Adjust the path as needed

// Create Track
router.post('/', async (req, res) => {
  try {
    const newTrack = await Track.create(req.body);
    return res.status(201).json(newTrack);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all Tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find();
    return res.status(200).json(tracks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
