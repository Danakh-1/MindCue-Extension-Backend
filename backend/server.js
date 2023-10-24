require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

//const TriggerRoutes = require('./routes/trigger-routes');
const usersRoutes = require('./routes/users-routes.js');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//app.use('/api/places', TriggrRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});



app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect('mongodb+srv://alenezidana:wWhiI2toFcXM9OlN@cluster0.mph5f4y.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
    console.log('Connected to MongoDB');
    console.log('Server running on 5000');
  })
  .catch(err => {
    console.log(err);
  });




























// require('dotenv').config();
// const express = require('express');
// const app = express();
// const path = require('path');
// const cors = require('cors');
// //const corsOptions = require('./config/corsOptions');
// const { logger } = require('./middleware/logEvents');
// const errorHandler = require('./middleware/errorHandler');
// //const verifyJWT = require('./middleware/verifyJWT');
// const cookieParser = require('cookie-parser');
// //const credentials = require('./middleware/credentials');
// const mongoose = require('mongoose');
// const connectDB = require('./config/dbConn');
// const PORT = process.env.PORT || 3500;


// // Connect to MongoDB
// connectDB();

// // custom middleware logger
// app.use(logger);

// // Handle options credentials check - before CORS!
// // and fetch cookies credentials requirement
// //app.use(credentials);

// // Cross Origin Resource Sharing
// //app.use(cors(corsOptions));

// // built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }));

// // built-in middleware for json 
// app.use(express.json());


























// //middleware for cookies
// app.use(cookieParser());

// //serve static files
// app.use('/', express.static(path.join(__dirname, '/public')));

// // routes
// //app.use('/', require('./routes/root'));
// app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth'));
// app.use('/refresh', require('./routes/refresh'));
// app.use('/logout', require('./routes/logout'));

// app.use(errorHandler);

// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });