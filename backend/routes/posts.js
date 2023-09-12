//all the routes that have to do something with  POST 
import express from 'express';

import {getpost} from '../controllers/posts.js';
const router = express.Router();
//add our routes

router.get('/', getpost);


export default router;