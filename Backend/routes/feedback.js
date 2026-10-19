const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");

const router = express.Router();


// SUBMIT FEEDBACK
router.post("/add", (req, res) => {

    const participantId = req.headers.payload.userId;

    const {
        event_id,
        session_id,
        rating,
        comment
    } = req.body;

    if (!event_id || !rating) {
        return res.send(
            result.createResult("Event ID and rating are required")
        );
    }

    if (rating < 1 || rating > 5) {
        return res.send(
            result.createResult("Rating must be between 1 and 5")
        );
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

        const checkFeedbackSql = `
            SELECT id
            FROM feedback
            WHERE event_id = ?
            AND participant_id = ?
            AND (
                (session_id = ?)
                OR (session_id IS NULL AND ? IS NULL)
            )
        `;

        pool.query(
            checkFeedbackSql,
            [
                event_id,
                participantId,
                session_id || null,
                session_id || null
            ],
            (err, data) => {

                if (err)
                    return res.send(result.createResult(err));

                if (data.length > 0)
                    return res.send(
                        result.createResult(
                            "Feedback already submitted"
                        )
                    );

                const sql = `
                    INSERT INTO feedback
                    (
                        event_id,
                        session_id,
                        participant_id,
                        rating,
                        comment
                    )
                    VALUES (?, ?, ?, ?, ?)
                `;

                pool.query(
                    sql,
                    [
                        event_id,
                        session_id || null,
                        participantId,
                        rating,
                        comment
                    ],
                    (err, data) => {

                        res.send(
                            result.createResult(err, data)
                        );
                    }
                );
            }
        );
    });
});


// GET MY FEEDBACK
router.get("/my", (req, res) => {

    const participantId = req.headers.payload.userId;

    const sql = `
        SELECT
            f.id,
            f.event_id,
            e.name AS event_name,
            f.session_id,
            s.name AS session_name,
            f.rating,
            f.comment,
            f.created_at
        FROM feedback f
        JOIN events e
            ON f.event_id = e.id
        LEFT JOIN sessions s
            ON f.session_id = s.id
        WHERE f.participant_id = ?
        ORDER BY f.created_at DESC
    `;

    pool.query(sql, [participantId], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET ALL FEEDBACK
router.get("/all", (req, res) => {

    const sql = `
        SELECT
            f.id,
            f.event_id,
            e.name AS event_name,
            f.session_id,
            s.name AS session_name,
            f.participant_id,
            u.name AS participant_name,
            u.email,
            f.rating,
            f.comment,
            f.created_at
        FROM feedback f
        JOIN events e
            ON f.event_id = e.id
        LEFT JOIN sessions s
            ON f.session_id = s.id
        JOIN users u
            ON f.participant_id = u.id
        ORDER BY f.created_at DESC
    `;

    pool.query(sql, (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET FEEDBACK FOR AN EVENT
router.get("/event/:eventId", (req, res) => {

    const { eventId } = req.params;

    const sql = `
        SELECT
            f.id,
            f.event_id,
            e.name AS event_name,
            f.session_id,
            s.name AS session_name,
            f.participant_id,
            u.name AS participant_name,
            f.rating,
            f.comment,
            f.created_at
        FROM feedback f
        JOIN events e
            ON f.event_id = e.id
        LEFT JOIN sessions s
            ON f.session_id = s.id
        JOIN users u
            ON f.participant_id = u.id
        WHERE f.event_id = ?
        ORDER BY f.created_at DESC
    `;

    pool.query(sql, [eventId], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET FEEDBACK BY ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            f.id,
            f.event_id,
            e.name AS event_name,
            f.session_id,
            s.name AS session_name,
            f.participant_id,
            u.name AS participant_name,
            f.rating,
            f.comment,
            f.created_at
        FROM feedback f
        JOIN events e
            ON f.event_id = e.id
        LEFT JOIN sessions s
            ON f.session_id = s.id
        JOIN users u
            ON f.participant_id = u.id
        WHERE f.id = ?
    `;

    pool.query(sql, [id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(
                result.createResult("Feedback not found")
            );

        res.send(result.createResult(null, data[0]));
    });
});


module.exports = router;