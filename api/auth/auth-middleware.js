const jwt = require("jsonwebtoken");
const secret = require("../../config/secret.js");

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        next();
    } else if (token) {
        jwt.verify(token, secret.jwtSecret, (err, decodedJwt) => {
            if (err) {
                res.status(401).json({ message: "access denied" });
            } else {
                req.decodedJwt = decodedJwt;
                next();
            }
        });
    } else {
        res.status(401).json({ message: "access denied" });
    }
};