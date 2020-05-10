const {check} = require('express-validator');

const expressValidation = (method) => {
    switch (method) {
        case 'createUser': {
            return [
                check('username', 'Username minimal terdiri dari 6 karakter huruf kecil')
                    .exists()
                    .isAlpha('en-US')
                    .isLowercase()
                    .isLength({min: 6}),
                check('email', 'Invalid email')
                    .exists()
                    .normalizeEmail()
                    .isEmail(),
                check('fullname')
                    .exists()
                    .isLength({min: 3, max: 255}),
                check('password', 'Password harus terdiri dari 8 karakter dan tidak mengandung karakter khusus')
                    .exists()
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
                check('address', 'Masukkan alamat yang benar')
                    .exists()
                    .isLength({min: 8, max: 255}),
                check('campus')
                    .exists(),
                check('status', 'Status yang dimasukkan salah')
                    .exists()
                    .isIn([1, 2, 3, 4, 5])
            ]
        }
    }
}

module.exports = {
    expressValidation
}
