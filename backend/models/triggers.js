//define the fields or schema of usres
const mongoose = require("mongoose");
const uniquevalidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
// Create Schema
//we need a reference back to the users
const triggerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: "users" 
  },
},{timestamps:true});
//name of the collectiom and export the name of the schema
// module.exports = mongoose.model("trigger", UserSchema);
module.exports = mongoose.model("triggers", triggerSchema);
