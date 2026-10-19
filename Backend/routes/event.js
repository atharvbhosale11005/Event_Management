const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");

const router = express.Router();


// CREATE EVENT
router.post("/add", (req, res) => {

    const {
        name,
        description,
        event_date,
        start_time,
        end_time,
        venue,
        status
    } = req.body;

    if (!name || !event_date || !start_time || !end_time || !venue) {
        return res.send(result.createResult("Required fields are missing"));
    }

    const sql = `
        INSERT INTO events
        (name, description, event_date, start_time, end_time, venue, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
        sql,
        [
            name,
            description,
            event_date,
            start_time,
            end_time,
            venue,
            status || "UPCOMING"
        ],
        (err, data) => {

            res.send(result.createResult(err, data));
        }
    );
});


// GET ALL EVENTS
router.get("/all", (req, res) => {

    const sql = `
        SELECT *
        FROM events
        ORDER BY event_date ASC, start_time ASC
    `;

    pool.query(sql, (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET EVENT BY ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM events
        WHERE id = ?
    `;

    pool.query(sql, [id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(result.createResult("Event not found"));

        res.send(result.createResult(null, data[0]));
    });
});


// UPDATE EVENT
router.put("/:id", (req, res) => {

    const { id } = req.params;

    const {
        name,
        description,
        event_date,
        start_time,
        end_time,
        venue,
        status
    } = req.body;

    if (!name || !event_date || !start_time || !end_time || !venue || !status) {
        return res.send(result.createResult("Required fields are missing"));
    }

    const sql = `
        UPDATE events
        SET
            name = ?,
            description = ?,
            event_date = ?,
            start_time = ?,
            end_time = ?,
            venue = ?,
            status = ?
        WHERE id = ?
    `;

    pool.query(
        sql,
        [
            name,
            description,
            event_date,
            start_time,
            end_time,
            venue,
            status,
            id
        ],
        (err, data) => {

            res.send(result.createResult(err, data));
        }
    );
});


// DELETE EVENT
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM events
        WHERE id = ?
    `;

    pool.query(sql, [id], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


module.exports = router;