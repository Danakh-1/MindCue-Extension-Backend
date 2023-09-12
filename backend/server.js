import express from 'express'; 
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import users from "./routes/posts.js";
import postRoutes from './routes/posts.js';
//initialise this app 
const app = express();

app.use('/posts', postRoutes)
//general setup
app.use(bodyparser.json({limit: "30mb", extended: true}));
app.use(bodyparser.urlencoded(({limit: "30mb", extended: true})));
app.use(cors());

//connect with mongodb
const CONNECTION_URL = "mongodb+srv://dana:Danamindcue@cluster0.lcu0ugq.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.port || 5000;

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log('server running on port: ${PORT} '))) 
    .catch((err) => console.log(err.message));
// to not get any warnings in the console

