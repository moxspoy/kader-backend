const session = require('express-session');
const {generateErrorResponse} = require("../../error/errorHandler");
const {INVALID_CREDENTIAL} = require('../../constants/errorCodes');

const sessionManagement = (req, res, next) => {
    if (req.session.loggedin || req.originalUrl === '/' || req.originalUrl === '/users/login') {
        next();
    } else {
        res.send(generateErrorResponse(401, INVALID_CREDENTIAL, 'Your request made by invalid credential'));
        res.end();
    }
}

module.exports = {
    sessionManagement
}
