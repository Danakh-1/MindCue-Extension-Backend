const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")//which a front-end client can make requests for resources to an external back-end server
const mongoose = require('mongoose');
const app = express();
const bcrypt = require("bcrypt");

const router = require('./routes/user-routers'); //import

const PORT = process.env.PORT || 3000;

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

app.use(express.json())
app.use(cors())
// This means that all routes defined in the user-routers module will be prefixed with /users. 
app.use("/users", router);


app.post('/login', (req, res) => {
    const {email, password} = req.body;
    userSchema.findOne({email: email})
    .then(user => {
        if(user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if(err) { 
                    res.json("the password is incorrect") 
                }
                if(response) {
                    res.json("correct password")
                }
            })
        } else {
            res.json("NO record exist")
        }
    })
	
})

 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


