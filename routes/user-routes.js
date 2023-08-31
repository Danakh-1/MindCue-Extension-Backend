const express = require('express');
const { getAllUsers } = require('../controller/user-controller');
 //declare a variable as a router//now we have a router inside the express
const router = express.Router();
//this router variable has all of the functionalities of this router
//and this contains all the request methods of the db
router.get("/",getAllUsers);

module.exports = router;
