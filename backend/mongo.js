// tells mongodb and mongo client which server we want to connect to.
const MongoClient = require('mongodb').MongoClient;

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
        const result = db.collection('users').insertONE(newuser);
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