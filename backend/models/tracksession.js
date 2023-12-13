//define the fields or schema of usres
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TrackSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  settings: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'settings',
  },
  fileDownloaded: {
    type: String, // Assuming the file content is stored as a string
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('track', TrackSchema);