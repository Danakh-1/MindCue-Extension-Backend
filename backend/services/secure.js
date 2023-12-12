const { jwtDecode } = require('jwt-decode');
const jwt = require('jsonwebtoken');
//const { privateKey } = require('../middleware/logEvents');
const privateKey = 'mysecretkey515';


const ensureToken = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, privateKey, function (err, decoded) {
            console.log(decoded)
        });
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
};

exports.ensureToken = ensureToken;
