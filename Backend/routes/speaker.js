const express = require("express");
const pool = require("../db/pool");
const result = require("../utils/result");

const router = express.Router();


// ADD SPEAKER
router.post("/add", (req, res) => {

    const {
        name,
        email,
        phone,
        bio,
        organization
    } = req.body;

    if (!name) {
        return res.send(result.createResult("Speaker name is required"));
    }

    const sql = `
        INSERT INTO speakers
        (name, email, phone, bio, organization)
        VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(
        sql,
        [
            name,
            email,
            phone,
            bio,
            organization
        ],
        (err, data) => {

            res.send(result.createResult(err, data));
        }
    );
});


// GET ALL SPEAKERS
router.get("/all", (req, res) => {

    const sql = `
        SELECT *
        FROM speakers
        ORDER BY name ASC
    `;

    pool.query(sql, (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// GET SPEAKER BY ID
router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM speakers
        WHERE id = ?
    `;

    pool.query(sql, [id], (err, data) => {

        if (err)
            return res.send(result.createResult(err));

        if (data.length === 0)
            return res.send(result.createResult("Speaker not found"));

        res.send(result.createResult(null, data[0]));
    });
});


// UPDATE SPEAKER
router.put("/:id", (req, res) => {

    const { id } = req.params;

    const {
        name,
        email,
        phone,
        bio,
        organization
    } = req.body;

    if (!name) {
        return res.send(result.createResult("Speaker name is required"));
    }

    const sql = `
        UPDATE speakers
        SET
            name = ?,
            email = ?,
            phone = ?,
            bio = ?,
            organization = ?
        WHERE id = ?
    `;

    pool.query(
        sql,
        [
            name,
            email,
            phone,
            bio,
            organization,
            id
        ],
        (err, data) => {

            res.send(result.createResult(err, data));
        }
    );
});


// DELETE SPEAKER
router.delete("/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM speakers
        WHERE id = ?
    `;

    pool.query(sql, [id], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// ASSIGN SPEAKER TO SESSION
router.post("/assign", (req, res) => {

    const {
        session_id,
        speaker_id
    } = req.body;

    if (!session_id || !speaker_id) {
        return res.send(
            result.createResult("Session ID and Speaker ID are required")
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

            const checkSpeakerSql = `
                SELECT id
                FROM speakers
                WHERE id = ?
            `;

            pool.query(
                checkSpeakerSql,
                [speaker_id],
                (err, data) => {

                    if (err)
                        return res.send(result.createResult(err));

                    if (data.length === 0)
                        return res.send(
                            result.createResult("Speaker not found")
                        );

                    const checkAssignmentSql = `
                        SELECT id
                        FROM session_speakers
                        WHERE session_id = ?
                        AND speaker_id = ?
                    `;

                    pool.query(
                        checkAssignmentSql,
                        [session_id, speaker_id],
                        (err, data) => {

                            if (err)
                                return res.send(result.createResult(err));

                            if (data.length > 0)
                                return res.send(
                                    result.createResult(
                                        "Speaker already assigned to this session"
                                    )
                                );

                            const sql = `
                                INSERT INTO session_speakers
                                (session_id, speaker_id)
                                VALUES (?, ?)
                            `;

                            pool.query(
                                sql,
                                [session_id, speaker_id],
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


// GET SPEAKERS OF A SESSION
router.get("/session/:sessionId", (req, res) => {

    const { sessionId } = req.params;

    const sql = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.phone,
            s.bio,
            s.organization
        FROM session_speakers ss
        JOIN speakers s
            ON ss.speaker_id = s.id
        WHERE ss.session_id = ?
        ORDER BY s.name ASC
    `;

    pool.query(sql, [sessionId], (err, data) => {

        res.send(result.createResult(err, data));
    });
});


// REMOVE SPEAKER FROM SESSION
router.delete(
    "/session/:sessionId/speaker/:speakerId",
    (req, res) => {

        const {
            sessionId,
            speakerId
        } = req.params;

        const sql = `
            DELETE FROM session_speakers
            WHERE session_id = ?
            AND speaker_id = ?
        `;

        pool.query(
            sql,
            [sessionId, speakerId],
            (err, data) => {

                if (err)
                    return res.send(result.createResult(err));

                if (data.affectedRows === 0)
                    return res.send(
                        result.createResult("Speaker assignment not found")
                    );

                res.send(result.createResult(null, data));
            }
        );
    }
);


module.exports = router;