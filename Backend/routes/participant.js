const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");

const router = express.Router();


// GET LOGGED-IN PARTICIPANT PROFILE
router.get("/profile", (req, res) => {

    const participantId = req.headers.payload.userId;

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE id = ?
        AND role = 'PARTICIPANT'
    `;

    pool.query(sql, [participantId], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(result.createResult("Participant not found"));

        res.send(result.createResult(null, data[0]));
    });
});


// GET ALL PARTICIPANTS
router.get("/all", (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE role = 'PARTICIPANT'
        ORDER BY name ASC
    `;

    pool.query(sql, (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET PARTICIPANT BY ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE id = ?
        AND role = 'PARTICIPANT'
    `;

    pool.query(sql, [id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(result.createResult("Participant not found"));

        res.send(result.createResult(null, data[0]));
    });
});


// GET PARTICIPANT'S REGISTERED EVENTS
router.get("/:id/events", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            e.id,
            e.name,
            e.description,
            e.event_date,
            e.start_time,
            e.end_time,
            e.venue,
            e.status,
            r.registered_at
        FROM registrations r
        JOIN events e
            ON r.event_id = e.id
        WHERE r.participant_id = ?
        ORDER BY e.event_date ASC, e.start_time ASC
    `;

    pool.query(sql, [id], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


module.exports = router;