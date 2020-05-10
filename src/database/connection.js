const DB_CONFIG = require("./config");
const mysql = require('mysql');

const pool = mysql.createPool(DB_CONFIG);

module.exports = {pool};

