//define the fields or schema of usres
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create Schema
//we need a reference back to the users
const sentReportSchema = new Schema({
  chatredID: {type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'},
  sentReport: {type: Boolean},  
  PatientReport: {type: Document},  
});
//name of the collectiom and export the name of the schema
module.exports = mongoose.model("sentReport", sentReportSchema);

