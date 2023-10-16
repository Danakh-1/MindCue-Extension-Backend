// tells mongodb and mongo client which server we want to connect to.
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient("mongodb://localhost:27017/MindCueDB");

client.connect(function(err, db) {
  if (err) {
    console.log(err);
    return;
  }

  // The database is now connected
  console.log("Connected to the database!");

  // You can now perform database operations
  db.collection("users").find().toArray(function(err, users) {
    if (err) {
      console.log(err);
      return;
    }

    // The users array now contains all of the users in the collection
    console.log(users);

    // Close the database connection
    db.close();
  });
});





const url = 'mongodb+srv://dana:Danamindcue@cluster0.lcu0ugq.mongodb.net/users?retryWrites=true&w=majority'

const creatuser = async(req, res, next) => {
    const newuser = { 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db();
        const result = db.collection('users').insertOne(newuser);
    } catch (err) {
        return res.json({message: 'could not store data'});
    };
    client.close();

    res.json(newuser);
};

const getusers = async (req, res, next) => {
    const client = new MongoClient(url);

    let users;
    try {
        await client.connect();
        const db = client.db
        //to get access to the existing users.
        const users = await db.collection('users').find().toArray();
    } catch (err) {
        return res.json({message: 'could not retrive users'});
    };
    client.close();
    res.json(users);
}




exports.creatuser = creatuser;
exports.getusers = getusers;