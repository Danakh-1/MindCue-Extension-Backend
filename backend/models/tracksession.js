//define the fields or schema of usres
const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create Schema
//we need a reference back to the users
//THE YouTubr URL snd description,timestap of the session saved in TET file created by mongDB. 
const TrackSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'},
  settings:{type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'settings'},
  timeStart: {type: Timestamp},
  title:{type: String},
  description:{type: String},
  timeReach:{type: Boolean},
  UserANS1:{type: Boolean},
  warningStatus:{type: Boolean},
  UserANS2:{type: Boolean},
  warningStatusHW:{type: Boolean},
  UserANS3:{type: Boolean},
  dataRecorded:{type: timestamp},
},
{
  timestamp: true
}
);


//name of the collectiom and export the name of the schema
module.exports = mongoose.model("settings", TrackSchema);

