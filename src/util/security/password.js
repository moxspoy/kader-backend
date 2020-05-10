const hash = require('pbkdf2-password')();

function hashPassword(plainPassword, fn) {
    let hashed = {};
    hash({password: plainPassword}, (err, pass, salt, hash) => {
        if (err) throw err;
        hashed = {salt, hash};
        fn(hashed);
    });
}

module.exports = {
    hashPassword
}


