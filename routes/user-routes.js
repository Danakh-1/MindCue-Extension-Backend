const express = require('express');
const { getAllUsers } = require('../controller/user-controller');
 //special tool the execute like a function //now we have a router inside the express
const router = express.Router();
//this router variable has all of the functionalities of this router
//and this contains all the request methods of the db
router.get("/",getAllUsers);


// Define your routes here
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    userSchema.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.json("success")
            } else {
                res.json("the password is incorrect")
            }
        } else {
            res.json("NO record exist")
        }
    })
	
})




module.exports = router;
