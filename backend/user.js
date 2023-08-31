// models of User.js/To define the structure of your data and provide an interface to interact with the database. 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    Email:{
        type: String,
        required: true,
        unique: true,
    },
    
    password:{
        type: String,
        required: true,
        minlength: 6,
    }, 
});

//export schema as a module
module.exports = mongoose.model('User', userSchema);

//inside the mongodb db there will be a new collection of the users name is usere!