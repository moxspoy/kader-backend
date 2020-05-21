const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();

function hashPassword(hashOptions, fn) {
    let hashed = {};
    if (!hashOptions.salt) {
        hasher(hashOptions, (err, pass, salt, hash) => {
            if (err) throw err;
            hashed = {salt, hash};
            fn(hashed);
        });
    } else {
        hasher(hashOptions, (err, pass, salt, hash2) => {
            hashed = {salt, hash: hash2};
            fn(hashed);
        });
    }
}

module.exports = {
    hashPassword
}


