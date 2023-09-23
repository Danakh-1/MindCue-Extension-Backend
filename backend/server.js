const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongomindcue = require('./mongo');
const cors = require('cors');

//initialise this app 
const app = express();
const usersRoutes = require('./routes/users-routes');
const TriggrsRoutes = require('./routes/TriggrsRoutes');

app.use(bodyParser.urlencoded({extended: true}));//uses the "querystring" library to parse URL-encoded data
app.use(bodyParser.json());

//import the path of routes 
app.use('/api/users', usersRoutes);
app.post('/users', mongomindcue.creatuser);


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });
  
app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  const PORT = process.env.port || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
