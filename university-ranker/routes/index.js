const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Home route - lists universities with 2024 rankings
router.get('/', (req, res) => {
    const sql = `
    SELECT u.*, r.Ranking
    FROM Universities u
    LEFT JOIN Rankings r ON u.Name = r.University AND r.Year = 2024
    WHERE r.Ranking != \"Not Ranked\"
    ORDER BY r.Ranking;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error during database query:', err);
            return res.status(500).send("Database error");
        }
        res.render('index', { universities: results });
    });
});

// Route to handle adding a favorite
router.post('/add-favorite', (req, res) => {
    const username = req.body.username; // You'll need to adjust how you handle user authentication
    const university = req.body.university;
    const sql = `INSERT INTO Favorites (Username, University) VALUES (?, ?)`;

    db.query(sql, [username, university], (err, result) => {
        if (err) {
            console.error('Error during database insert:', err);
            return res.status(500).send("Failed to add favorite");
        }
        res.redirect('/');
    });
});

module.exports = router;
