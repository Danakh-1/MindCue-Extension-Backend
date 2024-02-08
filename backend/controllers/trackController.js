// const Track = require('../models/tracksession.js');
// // Controller function to fetch all tracks
// exports.getAllTracks = async (req, res) => {
//   try {
//     const tracks = await Track.find();
//     res.json(tracks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };

// // Controller function to fetch a single track by ID
// exports.getTrackById = async (req, res) => {
//   try {
//     const track = await Track.findById(req.params.id);
//     if (!track) {
//       return res.status(404).json({ msg: 'Track not found' });
//     }
//     res.json(track);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };
const Track = require('../models/tracksession.js');

// Controller function to fetch all tracks
exports.getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller function to fetch tracks by user ID
exports.getTracksByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const tracks = await Track.find({ user: userId });
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller function to fetch a single track by ID
exports.getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ msg: 'Track not found' });
    }
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


// Controller function to fetch the most recent track by user ID
exports.getMostRecentTrackByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const track = await Track.findOne({ user: userId }).sort({ dataRecorded: -1 }).limit(1);
    if (!track) {
      return res.status(404).json({ msg: 'Track not found' });
    }
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
