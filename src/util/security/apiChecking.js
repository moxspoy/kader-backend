const {API_KEY_ALLOWED} = require('../../constants/apiConstant');
const {generateErrorResponse} = require('../../error/errorHandler');
const {INVALID_API_KEY} = require('../../constants/errorCodes');

const checkingApiKeyHandler = (req, res, next) => {
    const key = req.headers['api-key'];
    const isInvalid = !key || !~API_KEY_ALLOWED.indexOf(key);
    if (isInvalid) return res.send(generateErrorResponse(401, INVALID_API_KEY, 'API key required. Contact administrator to obtain API Key.'));
    req.key = key;
    next();
}

module.exports = {
    checkingApiKeyHandler
}
