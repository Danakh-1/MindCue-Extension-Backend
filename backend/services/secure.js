// const jwt = require('jsonwebtoken');
// const { promisify } = require('util');
// //const { privateKey } = require('../middleware/logEvents');
// const privateKey = 'mysecretkey515';

// const ensureToken = async (req, res, next) => {
// 	const bearerHeader = req.headers['authorization'];

// 	if (typeof bearerHeader !== 'undefined') {
// 		const bearer = bearerHeader.split(' ');
// 		const bearerToken = bearer[1];

// 		const decoded = await promisify(jwt.verify)(bearerToken, privateKey);
// 		console.log(decoded)

// 		const user = decoded; // Replace 'user' with the actual key in your JWT payload

// 		// Attach user information to the request object for future use
// 		req.user = user;

// 		next();
// 	} else {
// 		res.sendStatus(403);
// 	}
// };

// exports.ensureToken = ensureToken;
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const privateKey = 'mysecretkey515';

const ensureToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(403).send('No token provided');
    }

    const bearer = bearerHeader.split(' ');
    if (bearer.length !== 2 || bearer[0].toLowerCase() !== 'bearer') {
        return res.status(403).send('Invalid token format');
    }

    const bearerToken = bearer[1];

    try {
        const decoded = await promisify(jwt.verify)(bearerToken, privateKey);
        console.log(decoded);
        req.user = decoded; // Attach user information to the request object
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send('Token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token');
        } else {
            return res.status(500).send('Server error during token verification');
        }
    }
};

exports.ensureToken = ensureToken;
