const MongoClient = require('mongodb').MongoClient;

const url =
  'mongodb+srv://alenezidana:wWhiI2toFcXM9OlN@cluster0.mph5f4y.mongodb.net/?retryWrites=true&w=majority';

const createUser = async (req, res, next) => {
  const newuser = {
    name: req.body.name,
    email: req.body.email
  };
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    const result = db.collection('users').insertOne(newuser);
  } catch (error) {
    return res.json({message: 'Could not store data.'});
  };
  client.close();

  res.json(newProduct);
};

const getusers = async (req, res, next) => {
  const client = new MongoClient(url);

  let users;

  try {
    await client.connect();
    const db = client.db();
    users = await db.collection('users').find().toArray();
  } catch (error) {
    return res.json({message: 'Could not retrieve products.'});
  };
  client.close();

  res.json(users);
};

exports.createUser = createUser;
exports.getusers = getusers;

