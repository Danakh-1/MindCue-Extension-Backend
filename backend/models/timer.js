
const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  hours: Number,
  minutes: Number,
  seconds: Number,
});

module.exports = mongoose.model('Timer', timerSchema);
