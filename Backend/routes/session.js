const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");

const router = express.Router();


// CREATE SESSION
router.post("/add", (req, res) => {

    const {event_id,name,description,session_date,start_time,end_time,venue} = req.body;

    if (!event_id || !name || !session_date || !start_time || !end_time || !venue) {
        return res.send(result.createResult("Required fields are missing"));
    }

    const checkEventSql = `SELECT id FROM events WHERE id = ?`;

    pool.query(checkEventSql, [event_id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(result.createResult("Event not found"));

        const sql = `
            INSERT INTO sessions(event_id,name,description,session_date,start_time,end_time,venue) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        pool.query(sql,[event_id,name,description,session_date,start_time,end_time,venue],(err, data) => {
            res.send(result.createResult(err, data));
        });
    });
});


// GET ALL SESSIONS
router.get("/all", (req, res) => {

    const sql = `
        SELECT
            s.id,
            s.event_id,
            e.name AS event_name,
            s.name,
            s.description,
            s.session_date,
            s.start_time,
            s.end_time,
            s.venue
        FROM sessions s
        JOIN events e
            ON s.event_id = e.id
        ORDER BY s.session_date ASC, s.start_time ASC
    `;

    pool.query(sql, (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET SESSIONS OF AN EVENT
router.get("/event/:eventId", (req, res) => {

    const { eventId } = req.params;

    const sql = `SELECT s.id,s.event_id,e.name AS event_name,s.name,s.description,s.session_date,s.start_time,s.end_time,s.venue
    FROM sessions s JOIN events e ON s.event_id = e.id WHERE s.event_id = ? ORDER BY s.session_date ASC, s.start_time ASC`;

    pool.query(sql, [eventId], (err, data) => {
        res.send(result.createResult(err, data));
    });
});


// GET SESSION BY ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `SELECT s.id,s.event_id,e.name AS event_name,s.name,s.description,s.session_date,s.start_time,s.end_time,s.venue
    FROM sessions s Inner JOIN events e ON s.event_id = e.id WHERE s.id = ?`;

    pool.query(sql, [id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(result.createResult("Session not found"));

        res.send(result.createResult(null, data[0]));
    });
});


// UPDATE SESSION
router.put("/:id", (req, res) => {

    const { id } = req.params;

    const {name,description,session_date,start_time,end_time,venue} = req.body;

    if (!name || !session_date || !start_time || !end_time || !venue) {
        return res.send(result.createResult("Required fields are missing"));
    }

    const sql = `UPDATE sessions SET name = ?,description = ?,session_date = ?,start_time = ?,end_time = ?,venue = ? WHERE id = ?`;

    pool.query(sql,[name,description,session_date,start_time,end_time,venue,id],(err, data) => {
        res.send(result.createResult(err, data));
    });
});


// DELETE SESSION
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `DELETE FROM sessions WHERE id = ?`;

    pool.query(sql, [id], (err, data) => {
        res.send(result.createResult(err, data));
    });
});


module.exports = router;