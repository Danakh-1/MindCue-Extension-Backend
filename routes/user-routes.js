const express = require('express');
const { getAllUsers } = require('../controller/user-controller');
 //special tool the execute like a function //now we have a router inside the express
const router = express.Router();
//this router variable has all of the functionalities of this router
//and this contains all the request methods of the db
router.get("/",getAllUsers);


module.exports = router;
