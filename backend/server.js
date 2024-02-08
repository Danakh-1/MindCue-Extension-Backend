// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const path = require('path');
// const cors = require('cors');
// const { logger } = require('./middleware/logEvents');
// const errorHandler = require('./middleware/errorHandler');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const TriggerRoutes = require('./routes/triggers-routes');
// const usersRoutes = require('./routes/users-routes.js');
// const settingsRoutes = require('./routes/settings-routes');
// const HttpError = require('./models/http-error');
// const browsingDataRoutes = require('./routes/browsingData-routes');
// const trackRoutes = require('./routes/trackRoutes'); // Import the newly created trackRoutes

// //const trackRoutes = require('./routes/browsingData-routes'); // Create this file later

// app.use(express.static(path.join(__dirname, 'public')));

// /////////////////////////////parse incoming json data

// app.use((req, res, next) => {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
// 	);
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

// 	next();
// });

// //app.use('/api/track', trackRoutes);
// app.use('/api/triggers', TriggerRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/Tracks', browsingDataRoutes);
// app.use('/api/getLastTrack', trackRoutes); // Use the trackRoutes for /api/tracks endpoint
// app.use((req, res, next) => {
// 	const error = new HttpError('Could not find this route.', 404);
// 	throw error;
// });

// app.use((error, req, res, next) => {
// 	if (res.headerSent) {
// 		return next(error);
// 	}
// 	res.status(error.code || 500);
// 	res.json({ message: error.message || 'An unknown error occurred!' });
// });

// mongoose
// 	.connect(
// 		'mongodb+srv://alenezidana:wWhiI2toFcXM9OlN@cluster0.mph5f4y.mongodb.net/?retryWrites=true&w=majority'
// 	)
// 	.then(() => {
// 		app.listen(5000);
// 		console.log('Connected to MongoDB');
// 		console.log('Server running on 5000');
// 	})
// 	.catch(err => {
// 		console.log(err);
// 	});
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TriggerRoutes = require('./routes/triggers-routes');
const usersRoutes = require('./routes/users-routes.js');
const settingsRoutes = require('./routes/settings-routes');
const HttpError = require('./models/http-error');
const browsingDataRoutes = require('./routes/browsingData-routes');
const trackRoutes = require('./routes/trackRoutes'); // Import the newly created trackRoutes

app.use(express.static(path.join(__dirname, 'public')));

/////////////////////////////parse incoming json data

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/triggers', TriggerRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/Tracks', browsingDataRoutes);
app.use('/tracks', trackRoutes);app.use((req, res, next) => {
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
  .connect(
    'mongodb+srv://alenezidana:wWhiI2toFcXM9OlN@cluster0.mph5f4y.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5000);
    console.log('Connected to MongoDB');
    console.log('Server running on port 5000');
  })
  .catch(err => {
    console.log(err);
  });
