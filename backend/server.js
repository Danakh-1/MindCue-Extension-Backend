

const express = require("express");
//initialise this app 
const app = express();
const path = require('path');
const { logger } = require('./middleware/logger')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.port || 5000;
const cors = require('cors');

app.use(logger)
app.use('/', express.static(path.join(__dirname, '/triggers')))

const usersRoutes = require('./routes/users-routes');
// const settingsRoutes = require('./routes/userSelectionRoutes');

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//uses the "querystring" library to parse URL-encoded data
app.use(cors()); // Enable CORS for extension frontend
////////mongodb connection url/////////////
const mongoPractice = require('./mongoose');

app.use(bodyParser.json());

app.post('/users', mongoPractice.createUser);

app.get('/users', mongoPractice.getusers);

app.listen(5000);
app.use('/api/users', usersRoutes);
// app.post('/users', mongomindcue.creatuser);
// app.get('/users', mongomindcue.getusers);
// Import and use the user selection routes
// const userSelectionRoutes = require('./routes/userSelectionRoutes');
// app.use('/api/user-selection', userSelectionRoutes);


app.post('/signin', async (req, res) => {
  let user = new user(req.body);
  let result = await user.save();
  response.send(result);
})

app.post("/login", (req, res) => {
  response.send(result);
})

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });

// app.use((error, req, res, next) => {
//     if (res.headerSent) {
//       return next(error);
//     }
//     res.status(error.code || 500)
//     res.json({message: error.message || 'An unknown error occurred!'});
//   });

mongoose.connection.once('open', () => {
  console.log('connected to mongodb')
  app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})