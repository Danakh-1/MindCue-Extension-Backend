
// require('dotenv').config();
// const express = require('express');
// const app = express();
// const path = require('path');
// const cors = require('cors');
// const corsOptions = require('./config/corsOptions');
// const { logger } = require('./middleware/logEvents');
// const errorHandler = require('./middleware/errorHandler');
// const verifyJWT = require('./middleware/verifyJWT');
// const cookieParser = require('cookie-parser');
// const credentials = require('./middleware/credentials');
// const mongoose = require('mongoose');
// const connectDB = require('./config/dbConn');
// const PORT = process.env.PORT || 3500;

// // Connect to MongoDB
// connectDB();

// // custom middleware logger
// app.use(logger);

// // Handle options credentials check - before CORS!
// // and fetch cookies credentials requirement
// app.use(credentials);

// // Cross Origin Resource Sharing
// app.use(cors(corsOptions));

// // built-in middleware to handle urlencoded form data
// app.use(express.urlencoded({ extended: false }));

// // built-in middleware for json 
// app.use(express.json());

// //middleware for cookies
// app.use(cookieParser());

// //serve static files
// app.use('/', express.static(path.join(__dirname, '/public')));

// // routes
// app.use('/', require('./routes/root'));
// app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth'));
// app.use('/logout', require('./routes/logout'));

// app.use(verifyJWT);
// app.use('/employees', require('./routes/api/employees'));

// app.all('*', (req, res) => {
//     res.status(404);
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'views', '404.html'));
//     } else if (req.accepts('json')) {
//         res.json({ "error": "404 Not Found" });
//     } else {
//         res.type('txt').send("404 Not Found");
//     }
// });

// app.use(errorHandler);

// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });






















const express = require('express');
const bodyParser = require('body-parser');
const mongoUser = require('./mongoose');
const path = require('path');
const { logger } = require('./middleware/logger')
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for extension frontend

app.use(logger)

app.post('/users', mongoUser.createUser);
app.get('/users', mongoUser.getusers);

const usersRoutes = require('./routes/users-routes');
app.use('/api/users', usersRoutes);

app.post('/signin', async (req, res) => {
    let user = new user(req.body);
    let result = await user.save();
    response.send(result);
  })
  
  app.post("/login", (req, res) => {
    response.send(result);
  })




mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

const PORT = process.env.port || 5000;












// // const express = require("express");
// // //initialise this app 
// // const app = express();
// // const path = require('path');
// // const { logger } = require('./middleware/logger')
// // const bodyParser = require('body-parser');
// // const mongoose = require('mongoose');
// // const PORT = process.env.port || 5000;
// // const cors = require('cors');

// // app.use(logger)
// // //app.use('/', express.static(path.join(__dirname, '/triggers')))

// // // const settingsRoutes = require('./routes/userSelectionRoutes');

// // //middlewares
// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));//uses the "querystring" library to parse URL-encoded data
// // app.use(cors()); // Enable CORS for extension frontend
// // ////////mongodb connection url/////////////

// // app.use(bodyParser.json());

// // app.post('/users', mongoPractice.createUser);

// // app.get('/users', mongoPractice.getusers);

// // app.listen(5000);
// // app.use('/api/users', usersRoutes);
// // // app.post('/users', mongomindcue.creatuser);
// // // app.get('/users', mongomindcue.getusers);
// // // Import and use the user selection routes
// // // const userSelectionRoutes = require('./routes/userSelectionRoutes');
// // // app.use('/api/user-selection', userSelectionRoutes);


// // app.post('/signin', async (req, res) => {
// //   let user = new user(req.body);
// //   let result = await user.save();
// //   response.send(result);
// // })

// // app.post("/login", (req, res) => {
// //   response.send(result);
// // })

// // app.use((req, res, next) => {
// //     const error = new HttpError('Could not find this route.', 404);
// //     throw error;
// //   });

// // // app.use((error, req, res, next) => {
// // //     if (res.headerSent) {
// // //       return next(error);
// // //     }
// // //     res.status(error.code || 500)
// // //     res.json({message: error.message || 'An unknown error occurred!'});
// // //   });
// // app.listen(5000);
// // mongoose.connection.once('open', () => {
// //   console.log('connected to mongodb')
// //   app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
// // })

// // mongoose.connection.on('error', err => {
// //   console.log(err)
// //   logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
// // })