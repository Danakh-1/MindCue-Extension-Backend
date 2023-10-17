//define the fields or schema of usres
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Create Schema
//we need a reference back to the users
const chatBoxSchema = new Schema({
  userID: {type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'},
  chatRegIDtID: {type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'pat_doc_reg'},  
});
//name of the collectiom and export the name of the schema
module.exports = mongoose.model("chatBox", chatBoxSchema);

