const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routers/user-router');
const app = express();
const PORT = process.env.PORT || 3000;

// defining the Middleware
app.use("/users", router);
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MindCueDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define your routes here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


