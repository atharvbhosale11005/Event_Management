const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");

const router = express.Router();


// MARK ATTENDANCE
router.post("/mark", (req, res) => {

    const {
        session_id,
        participant_id,
        status
    } = req.body;

    if (!session_id || !participant_id || !status) {
        return res.send(
            result.createResult(
                "Session ID, Participant ID and status are required"
            )
        );
    }

    if (status !== "PRESENT" && status !== "ABSENT") {
        return res.send(
            result.createResult("Invalid attendance status")
        );
    }

    const checkSessionSql = `
        SELECT id
        FROM sessions
        WHERE id = ?
    `;

    pool.query(
        checkSessionSql,
        [session_id],
        (err, data) => {

            if (err)
                return res.send(result.createResult(err));

            if (data.length === 0)
                return res.send(result.createResult("Session not found"));

            const checkParticipantSql = `
                SELECT id
                FROM users
                WHERE id = ?
                AND role = 'PARTICIPANT'
            `;

            pool.query(
                checkParticipantSql,
                [participant_id],
                (err, data) => {

                    if (err)
                        return res.send(result.createResult(err));

                    if (data.length === 0)
                        return res.send(
                            result.createResult("Participant not found")
                        );

                    const checkAttendanceSql = `
                        SELECT id
                        FROM attendance
                        WHERE session_id = ?
                        AND participant_id = ?
                    `;

                    pool.query(
                        checkAttendanceSql,
                        [session_id, participant_id],
                        (err, data) => {

                            if (err)
                                return res.send(result.createResult(err));

                            if (data.length > 0)
                                return res.send(
                                    result.createResult(
                                        "Attendance already marked"
                                    )
                                );

                            const sql = `
                                INSERT INTO attendance
                                (session_id, participant_id, status)
                                VALUES (?, ?, ?)
                            `;

                            pool.query(
                                sql,
                                [
                                    session_id,
                                    participant_id,
                                    status
                                ],
                                (err, data) => {

                                    res.send(
                                        result.createResult(err, data)
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});


// UPDATE ATTENDANCE
router.put("/:id", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.send(
            result.createResult("Attendance status is required")
        );
    }

    if (status !== "PRESENT" && status !== "ABSENT") {
        return res.send(
            result.createResult("Invalid attendance status")
        );
    }

    const sql = `
        UPDATE attendance
        SET status = ?,
            marked_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    pool.query(
        sql,
        [status, id],
        (err, data) => {

            res.send(result.createResult(err, data));
        }
    );
});


// GET ATTENDANCE FOR A SESSION
router.get("/session/:sessionId", (req, res) => {

    const { sessionId } = req.params;

    const sql = `
        SELECT
            a.id,
            a.session_id,
            a.participant_id,
            u.name AS participant_name,
            u.email,
            a.status,
            a.marked_at
        FROM attendance a
        JOIN users u
            ON a.participant_id = u.id
        WHERE a.session_id = ?
        ORDER BY u.name ASC
    `;

    pool.query(sql, [sessionId], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET MY ATTENDANCE
router.get("/my", (req, res) => {

    const participantId = req.headers.payload.userId;

    const sql = `
        SELECT
            a.id,
            a.session_id,
            s.name AS session_name,
            s.session_date,
            s.start_time,
            s.end_time,
            s.venue,
            e.id AS event_id,
            e.name AS event_name,
            a.status,
            a.marked_at
        FROM attendance a
        JOIN sessions s
            ON a.session_id = s.id
        JOIN events e
            ON s.event_id = e.id
        WHERE a.participant_id = ?
        ORDER BY s.session_date ASC, s.start_time ASC
    `;

    pool.query(sql, [participantId], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET ATTENDANCE BY ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            a.id,
            a.session_id,
            s.name AS session_name,
            a.participant_id,
            u.name AS participant_name,
            u.email,
            a.status,
            a.marked_at
        FROM attendance a
        JOIN sessions s
            ON a.session_id = s.id
        JOIN users u
            ON a.participant_id = u.id
        WHERE a.id = ?
    `;

    pool.query(sql, [id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(
                result.createResult("Attendance record not found")
            );

        res.send(result.createResult(null, data[0]));
    });
});


module.exports = router;