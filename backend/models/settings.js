//define the fields or schema of usres
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create Schema
//we need a reference back to the users
const settingsSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'},
  checkboxValues: {
      type: [String], // Assuming checkbox values are strings
      default: [],
    },
  radioButtonValue: {
      type: String, // Assuming radio button value is a string
      default: null,
    },
    testValue: {
      type: Boolean,
      default: false,
    }
});
//name of the collectiom and export the name of the schema
module.exports = mongoose.model("settings", settingsSchema);

