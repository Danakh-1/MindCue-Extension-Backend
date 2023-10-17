//define the fields or schema of usres
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create Schema
//we need a reference back to the users
const chatRegSchema = new Schema({
  doctorID: {type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'},
  PatientID: {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'},  
});
//name of the collectiom and export the name of the schema
module.exports = mongoose.model("pat_doc_reg", chatRegSchema);

