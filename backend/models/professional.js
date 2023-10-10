//define the fields or schema of usres
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ProfessionalSchema = new Schema({
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
  LicenseID: {
    type: String
  },
ClincAdd: {
  type: String
},
ClincNo: {
  type: Number
},
  registrationDate: { 
    type: Date, default: Date.now
  },
  resetpassword: {
    type: String
  }
});
module.exports = user = mongoose.model("Professional", ProfessionalSchema);
