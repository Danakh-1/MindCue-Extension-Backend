const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController.js');

// Route to fetch all tracks
router.get('/', trackController.getAllTracks);

// Route to fetch a single track by ID
router.get('/:id', trackController.getTrackById);
// Route to fetch tracks by user ID
router.get('/user/:userId', trackController.getTracksByUserId);
// Route to fetch the most recent track by user ID
router.get('/user/:userId/recent', trackController.getMostRecentTrackByUserId);

module.exports = router;
