const express = require('express');
const router = express.Router();
const multer = require('multer');
const Track = require('../models/tracksession'); // Adjust the path as needed

// Set up Multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory (you can customize this)
const upload = multer({ storage: storage });

// Create Track with File
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Assuming 'file' is the name attribute of the file input in your form
    const fileContent = req.file.buffer.toString('utf-8');

    const newTrack = await Track.create({
      user: req.body.user, // Assuming user ID is passed in the request body
      settings: req.body.settings, // Assuming settings ID is passed in the request body
      fileDownloaded: fileContent,
    });

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
