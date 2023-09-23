//define the fields or schema of usres
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
    minlength: 6,
  },
  usertype: {
    type: String,
    required: true,
    enum: ['patient', 'guest', 'doctor'],
  },
  validated: {
    type: Boolean,
    required: true
  },
  validateEmailToken:{
    type: String
  },
  EMGName: {
    type: String
  },
  EMGphone: {
    type: String
  },
  EMGRelationship: {
    type: String
  },
  registrationDate: { 
    type: Date, default: Date.now
  },
  resetpassword: {
    type: String
  }
});
module.exports = user = mongoose.model("users", UserSchema);
