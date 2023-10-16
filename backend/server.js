const express = require("express");
//initialise this app 
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongomindcue = require('./mongo');
const cors = require('cors');

app.use('/', express.static(path.join(__dirname, '/triggers')))
// const usersRoutes = require('./routes/users-routes');
// const settingsRoutes = require('./routes/userSelectionRoutes');

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//uses the "querystring" library to parse URL-encoded data
app.use(cors()); // Enable CORS for extension frontend
//////////mongodb connection url/////////////
//routes 
// app.use('/api/users', usersRoutes);
// // app.post('/users', mongomindcue.creatuser);
// // app.get('/users', mongomindcue.getusers);
// // Import and use the user selection routes
// const userSelectionRoutes = require('./routes/userSelectionRoutes');
// app.use('/api/user-selection', userSelectionRoutes);

// const timerRoutes = require('./routes/timerRoutes');
// app.use('/api/timer', timerRoutes);

// app.post('/signin', async (req, res) => {
//   let user = new user(req.body);
//   let result = await user.save();
//   response.send(result);
// })

// app.post("/login", (req, res) => {
//   response.send(result);
// })

// app.use((req, res, next) => {
//     const error = new HttpError('Could not find this route.', 404);
//     throw error;
//   });

// app.use((error, req, res, next) => {
//     if (res.headerSent) {
//       return next(error);
//     }
//     res.status(error.code || 500)
//     res.json({message: error.message || 'An unknown error occurred!'});
//   });

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
