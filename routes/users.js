const {hashPassword} = require("../src/util/security/password");
const {expressValidation} = require("../src/validation/expressValidation");
const {validationResult} = require('express-validator');
const {WRONG_INPUT_CODE} = require('../src/constants/errorCodes');

const {pool} = require('../src/database/connection');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/', expressValidation('createUser'), (req, res) => {
  const body = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      code: WRONG_INPUT_CODE,
      errors: errors.array()
    });
  }

  hashPassword(body.password, (hashedPassword) => {
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
    };

    pool.getConnection((err, con) => {
      if (err) return res.send(400);
      con.query(query, values, handler);
    });
  });
})

module.exports = router;
