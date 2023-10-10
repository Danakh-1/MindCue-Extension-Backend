const mongoose = require('mongoose');

const UserSelection = new mongoose.Schema({
  selectedOption: String,
});

module.exports = mongoose.model('Setting', UserSelection);
