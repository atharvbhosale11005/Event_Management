const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "atharv",
    database: "event_management",
    connectionLimit: 10
});

module.exports = pool;