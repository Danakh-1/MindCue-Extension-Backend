const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")//which a front-end client can make requests for resources to an external back-end server
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser'); //???????????????????????????????????????????
const nodemailer = require('nodemailer');

const userSchema= require('./models/ReactDataSchema')
const router = require('./routes/user-routers'); //import

const app = express();
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
                if(response) {
                    const token = jwt.sign({email: user.email, role: user.role},
                        "jwt-secret-key", {expiresIn: "id"})

                    res.cookie('token', token)
                    return res.json({status: "success", role: user.role})
                } else { 
                    res.json("the password is incorrect") 
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

//forget and reset password
app.post("/forgetpassword", (req, res) => {
    const {email} = req.body;
    userSchema.findOne({email: email})
    .then(user => {
        if(!user){
            return res.send({status: "User not existed"})    
        }//should be install jwt packgw and set it upppp!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const token = jwt.sign({id: user._id}, "JWT_secret_key", {expiresIn: "id"})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'danasallal33@gmail.com',
              pass: 'Asd@23kn'
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: 'myfriend@yahoo.com',
            subject: 'Reset your Passwors',
            ////the port no of frond end will be the rote!!!!!!!!!!!!!
            text: 'http://localhost/reset-password/${user._id}/${token}'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({status: "success"})
            }
          });
    })
})
//fina a record based on id