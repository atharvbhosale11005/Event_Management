const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");

const router = express.Router();


// REGISTER FOR EVENT
router.post("/add", (req, res) => {

    const participantId = req.headers.payload.userId;
    const { event_id } = req.body;

    if (!event_id) {
        return res.send(result.createResult("Event ID is required"));
    }

    const checkEventSql = `
        SELECT id
        FROM events
        WHERE id = ?
    `;

    pool.query(checkEventSql, [event_id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(result.createResult("Event not found"));

        const checkRegistrationSql = `
            SELECT id
            FROM registrations
            WHERE event_id = ?
            AND participant_id = ?
        `;

        pool.query(
            checkRegistrationSql,
            [event_id, participantId],
            (err, data) => {

                if (err)
                    return res.send(result.createResult(err));

                if (data.length > 0)
                    return res.send(
                        result.createResult("Already registered for this event")
                    );

                const sql = `
                    INSERT INTO registrations
                    (event_id, participant_id)
                    VALUES (?, ?)
                `;

                pool.query(
                    sql,
                    [event_id, participantId],
                    (err, data) => {

                        res.send(result.createResult(err, data));
                    }
                );
            }
        );
    });
});


// CANCEL EVENT REGISTRATION
router.delete("/:eventId", (req, res) => {

    const participantId = req.headers.payload.userId;
    const { eventId } = req.params;

    const sql = `
        DELETE FROM registrations
        WHERE event_id = ?
        AND participant_id = ?
    `;

    pool.query(
        sql,
        [eventId, participantId],
        (err, data) => {

            if (err)
                return res.send(result.createResult(err));

            if (data.affectedRows === 0)
                return res.send(
                    result.createResult("Registration not found")
                );

            res.send(result.createResult(null, data));
        }
    );
});


// GET MY REGISTRATIONS
router.get("/my", (req, res) => {

    const participantId = req.headers.payload.userId;

    const sql = `
        SELECT
            r.id,
            r.event_id,
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

    pool.query(sql, [participantId], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET PARTICIPANTS REGISTERED FOR AN EVENT
router.get("/event/:eventId", (req, res) => {

    const { eventId } = req.params;

    const sql = `
        SELECT
            r.id,
            u.id AS participant_id,
            u.name,
            u.email,
            r.registered_at
        FROM registrations r
        JOIN users u
            ON r.participant_id = u.id
        WHERE r.event_id = ?
        ORDER BY r.registered_at ASC
    `;

    pool.query(sql, [eventId], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


module.exports = router;