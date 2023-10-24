// const mongoose = require('mongoose');

// const Product = require('./models/user');

// mongoose.connect(
//   'mongodb+srv://alenezidana:wWhiI2toFcXM9OlN@cluster0.mph5f4y.mongodb.net/?retryWrites=true&w=majority'
// ).then(() => {
//     console.log('Connected to database!')
// }).catch(() => {
//     console.log('Connection failed!')
// });

// const createUser = async (req, res, next) => {
//   const createduser = new user({
//     name: req.body.name,
//     email: req.body.email
//   });
  
//   const result = await createduser.save();
//   console.log(typeof createduser._id);
//   res.json(result);
// };

// const getusers = async (req, res, next) => {
//   const users = await users.find().exec();
//   res.json(users);
// }

// exports.createUser = createUser;
// exports.getusers = getusers;
