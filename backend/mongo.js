// tells mongodb and mongo client which server we want to connect to.
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://dana:Danamindcue@cluster0.lcu0ugq.mongodb.net/users?retryWrites=true&w=majority'

const creatuser = async(req, res, next) => {
    const newuser = {
        name: req.body.name,
        email: req.body.email
    };
    const client = new MongoClient(url);
    const db = client.db();
    const result = db.collection('users').insertONE(newuser);

    try {
        await client.connect();

    } catch (error) {
        return res.json({message: 'could not store data'});
    };
    client.close();

    res.json(newuser);
};

exports.creatuser = creatuser;