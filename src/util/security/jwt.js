const jsonwebtoken = require('jsonwebtoken');
const {JWT_SECRET} = require('../../constants/securityConstant');
const expressJwt = require('express-jwt');

const signJwt = (payload) => {
    const EXPIRED_DAY_AFTER = 3;
    payload.exp = Math.floor(Date.now() / 1000) + (60 * 60 * EXPIRED_DAY_AFTER);
    return {
        token: jsonwebtoken.sign(payload, JWT_SECRET)
    };
}

const jwt = () => {
    return expressJwt({secret: JWT_SECRET}).unless({
        path: ['/', '/users/login',]
    })
}

module.exports = {
    signJwt,
    jwt
};
