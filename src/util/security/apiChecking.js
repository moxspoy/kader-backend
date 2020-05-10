const {API_KEY_ALLOWED} = require('../../constants/apiConstant');
const {error} = require('../../error/errorHandler');

const checkingApiKeyHandler = (req, res, next) => {
    const key = req.headers['api-key'];
    if (!key) return res.send(error(400, 'API key required. Contact administrator to obtain API Key.'));
    if (!~API_KEY_ALLOWED.indexOf(key)) return res.send(error(401, 'Invalid API Key.'));
    req.key = key;
    console.log('req_key', req.key);
    next();
}

module.exports = {
    checkingApiKeyHandler
}
