const {hashPassword} = require("../src/util/security/password");
const {expressValidation} = require("../src/validation/expressValidation");
const {generateErrorResponse} = require("../src/error/errorHandler");
const {validationResult} = require('express-validator');
const {WRONG_INPUT_CODE, INVALID_USERNAME_OR_PASSWORD, DATABASE_ERROR_CODE} = require('../src/constants/errorCodes');
const {JWT_SECRET} = require('../src/constants/securityConstant');

const {pool} = require('../src/database/connection');
const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');

/* GET users listing. */
router.get('/', (req, res, next) => {
  pool.getConnection((err, con) => {
    if (err) return res.send(generateErrorResponse(400, DATABASE_ERROR_CODE, 'Problem with database'));

    const query = 'SELECT * FROM users';
    const handler = (error, results, fields) => {
      if (error) throw error;

      const filteredResult = results.map(({password, salt, ...remains}) => remains)
      res.send(filteredResult);
    }
    con.query(query, handler);
  });
});

router.post('/', expressValidation('createUser'), (req, res) => {
  const body = req.body;
  const hashOptions = {
    password: body.password
  };

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      code: WRONG_INPUT_CODE,
      errors: errors.array()
    });
  }

  hashPassword(hashOptions, (hashedPassword) => {
    const query = 'INSERT INTO users (username, email, fullname, password, salt, address, campus, status) ' +
        'VALUES (?,?, ?, ?, ?, ?, ?, ?)';
    const values = [body.username, body.email, body.fullname, hashedPassword.hash, hashedPassword.salt, body.address, body.campus, body.status];
    const handler = (error, results, fields) => {
      if (error) throw error;
      const data = {
        userName: body.username,
        email: body.email,
        fullName: body.fullname,
        address: body.address,
        campus: body.campus,
        status: body.status,
      }
      res.send(data);
      res.end();
    };

    pool.getConnection((err, con) => {
      if (err) return res.send(400);
      con.query(query, values, handler);
    });
  });
});


router.post('/login', expressValidation('login'), (req, res) => {
  const body = req.body;
  const hashOptions = {
    password: body.password
  };
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      code: WRONG_INPUT_CODE,
      errors: errors.array()
    });
  }

  pool.getConnection((err, con) => {
    const query = 'SELECT salt, password FROM users WHERE username = ?';
    const values = [body.username];
    const handler = (error, results, fields) => {
      if (results && results.length && results[0].salt) {
        const saltFromDatabase = results[0].salt;
        const hashFromDatabase = results[0].password;
        hashOptions.salt = saltFromDatabase;

        hashPassword(hashOptions, (hashedPassword) => {
          if (hashedPassword.hash === hashFromDatabase) {
            const newQuery = 'SELECT * FROM users WHERE username = ? AND salt = ?';
            const newValues = [body.username, saltFromDatabase];
            const handler = (error, results, fields) => {
              if (error) throw error;
              if (results.length > 0) {
                const data = {
                  userId: results[0].id,
                  message: 'Login success'
                }

                return res.send(data);
              } else {
                res.send(generateErrorResponse(401, INVALID_USERNAME_OR_PASSWORD, 'Username atau Password yang dimasukkan salah'));
              }
            };

            pool.getConnection((err, con) => {
              if (err) return res.send(400);
              con.query(newQuery, newValues, handler);
            });
          } else {
            res.send(generateErrorResponse(401, INVALID_USERNAME_OR_PASSWORD, 'Username atau Password yang dimasukkan salah'));
          }
        });
      } else {
        res.send(generateErrorResponse(401, INVALID_USERNAME_OR_PASSWORD, 'Username atau Password yang dimasukkan salah'));
      }
    }
    if (err) return res.send(400);
    con.query(query, values, handler);
  });
})

module.exports = router;
