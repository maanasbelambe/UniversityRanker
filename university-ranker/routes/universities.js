const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/universities/:universityName', async (req, res) => {
    const universityName = req.params.universityName;
    try {
        const universityInfo = await db.promise().query(
            "SELECT * FROM Universities WHERE Name = ?", [universityName]
        );
        const offeredSubjects = await db.promise().query(
            "SELECT s.* FROM OfferedSubjects os JOIN Subjects s ON os.Subject = s.Name WHERE os.University = ?", [universityName]
        );
        const rankings = await db.promise().query(
            "SELECT * FROM Rankings WHERE University = ? ORDER BY Year DESC", [universityName]
        );

        res.render('university', { 
            university: universityInfo[0][0], 
            offeredSubjects: offeredSubjects[0], 
            rankings: rankings[0] 
        });
    } catch (err) {
        console.error('Error during database query:', err);
        res.status(500).send("Database error");
    }
});

module.exports = router;
