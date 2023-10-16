// const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const user = require('../models/user');

// const HttpError = require('../models/http-error');

// const getUsers = async (req, res, next) => {
//   //this code attempts to fetch users from the database , if there's an error during the database query, it creates a custom HttpError 
//   let users;
//   try {
//     users = await user.find({}, 'password');
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching users failed, please try again.',
//       500
//     );
//     return next(error);
//   }
//   res.json({ users: users.map(user => user.toObject({ getters: true })) });
// };

// const signup = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your data.', 422)
//     );
//   }
 
//   const { name, email, password } = req.body;

//   let existingUser;
//   try {
//     existingUser = await user.findOne({ email: email });
//   } catch (err) {
//     const error = new HttpError(
//       'Signing up failed, please try again later.',
//       500
//     );
//     return next(error);
//   }
// //if user has an account 
//   if (existingUser) {
//     const error = new HttpError(
//       'User exists already, please login instead.',
//       422
//     );
//     return next(error);
//   }

//   let hashedPassword;
//   try {
//     hashedPassword = await bcrypt.hash(password, 12);
//   } catch (err) {
//     const error = new HttpError(
//       'Could not create user, please try again.',
//       500
//     );
//     return next(error);
//   }

// //to create an user && encrypt a password
//   const createdUser = new user({
//     name,
//     email,
//     password: hashedPassword,
//     userType,
//   });

//   try {
//     await createdUser.save();
//   } catch (err) {
//     const error = new HttpError(
//       'Signing up failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   let token;
//   try {
//     token = jwt.sign(
//       { userID: createdUser.id, email: createdUser.email }, //for our respone i will convert mongoose object to default js object, so it will removes the ID underscore
//       'supersecret',
//       { expiresIn: '1h' }
//     ); // the token we send back can't be faked or edited by the user
//   } catch (err) {
//     const error = new HttpError(
//       'Signing up failed, please try again later.',
//       500
//     );
//     return next(error);
//   }
//   res.status(201).json({ userID: createdUser.id, email: createdUser.email, token: token });
// };

// const login = async (req, res, next) => {
//   const { email, password } = req.body;

//   let existingUser;

//   try {
//     existingUser = await user.findOne({ email: email });
//   } catch (err) {
//     const error = new HttpError(
//       'Loggin in failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   if (!existingUser) {
//     const error = new HttpError(
//       'Invalid credentials, could not log you in.',
//       401
//     );
//     return next(error);
//   }

//   let isValidPassword = false;
//   try {
//     isValidPassword = await bcrypt.compare(password, existingUser.password);
//   } catch (err) {
//     const error = new HttpError(
//       'Could not log you in, please check your credentials and try again.',
//       500
//     );
//     return next(error);
//   }

//   if (!isValidPassword) {
//     const error = new HttpError(
//       ' could not log you in.',
//       401
//     );
//     return next(error);
//   }

//   let token;
//   try {
//     token = jwt.sign(
//       { userID: existingUser.id, email: existingUser.email },
//       'supersecret', //use the same private key as past or will go for another token
//       { expiresIn: '1h' }
//     ); // the token we send back can't be faked or edited by the user
//   } catch (err) {
//     const error = new HttpError(
//       'loging in faild, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   res.json({
//     userID: existingUser.id,
//     email: existingUser.email,
//     token: token
//   });
// };

// exports.getUsers = getUsers;
// exports.signup = signup;
// exports.login = login;
