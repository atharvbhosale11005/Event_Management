const express = require("express");
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const result = require("../utils/result");
const config = require("../utils/config");

const router = express.Router();

router.post("/register/user", (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send(result.createResult("All fields are required"));
    }

    const hashedPassword = cryptojs.SHA256(password).toString();

    const checkSql = `SELECT id FROM users WHERE email = ?`;

    pool.query(checkSql, [email], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length > 0)
            return res.send(result.createResult("Email already exists"));

        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, 'PARTICIPANT')
        `;

        pool.query(
            sql,
            [name, email, hashedPassword],
            (err, data) => {

                res.send(result.createResult(err, data));
            }
        );
    });
});


router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.send(result.createResult("Email and Password are required"));
    }

    const hashedPassword = cryptojs.SHA256(password).toString();

    const sql = `
        SELECT id, name, email, role
        FROM users
        WHERE email = ?
        AND password = ?
    `;

    pool.query(
        sql,
        [email, hashedPassword],
        (err, data) => {

            if (err)
                return res.send(result.createResult(err));

            if (data.length === 0)
                return res.send(
                    result.createResult("Invalid Email or Password")
                );

            const user = data[0];

            const payload = {
                userId: user.id,
                email: user.email,
                role: user.role
            };

            const token = jwt.sign(
                payload,
                config.SECRET
            );

            res.send(
                result.createResult(null, {
                    token,
                    user: {
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                })
            );
        }
    );
});


module.exports = router;