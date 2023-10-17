//define the fields or schema of usres
const mongoose = require("mongoose");
const uniquevalidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
// Create Schema
//we need a reference back to the users
const triggerSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'},
});
//name of the collectiom and export the name of the schema
module.exports = mongoose.model("trigger", UserSchema);

