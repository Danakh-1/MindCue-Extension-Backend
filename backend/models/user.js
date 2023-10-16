//define the fields or schema of usres
const mongoose = require("mongoose");
const uniquevalidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {type: String,required: true},
  email: {type: String,required: true,unique: true,},
  password:{type: String,required: true, minlength: 6,},
  userType:{type: String},
  validated: { type: Boolean, required: true},
  validateEmailToken:{type: String},
  EMGName: {type: String},
  EMGphone: {type: String},
  EMGRelationship: {type: String},
  registrationDate: { type: Date, default: Date.now},
  resetpassword: {type: String}
});
//name of the collectiom and export the name of the schema
module.exports = user = mongoose.model("users", UserSchema);
