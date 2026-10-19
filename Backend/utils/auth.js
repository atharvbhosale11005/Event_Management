const jwt = require("jsonwebtoken");
const config = require("./config");
const result = require("./result");

const authUser = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.send(result.createResult("Token is required"));
    }

    try {

        const payload = jwt.verify(token, config.SECRET);

        req.headers.payload = payload;

        next();

    } catch (error) {

        return res.send(result.createResult("Invalid or expired token"));
    }
};

const checkUserAuthorization = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.send(result.createResult("Token is required"));
    }

    try {

        const payload = jwt.verify(token, config.SECRET);

        req.headers.payload = payload;

        next();

    } catch (error) {

        return res.send(result.createResult("Invalid or expired token"));
    }
};

module.exports = {
    authUser,
    checkUserAuthorization
};