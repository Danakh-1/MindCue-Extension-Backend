const jwt = require('jsonwebtoken');
const { promisify } = require('util');
//const { privateKey } = require('../middleware/logEvents');
const privateKey = 'mysecretkey515';

const ensureToken = async (req, res, next) => {
	const bearerHeader = req.headers['authorization'];

	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];

		const decoded = await promisify(jwt.verify)(bearerToken, privateKey);

		const user = decoded; // Replace 'user' with the actual key in your JWT payload

		// Attach user information to the request object for future use
		req.user = user;

		next();
	} else {
		res.sendStatus(403);
	}
};

exports.ensureToken = ensureToken;
