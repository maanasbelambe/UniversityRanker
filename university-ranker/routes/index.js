const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
    const searchQuery = req.query.search;
    let sql = `
        SELECT u.*, r.Ranking
        FROM Universities u
        LEFT JOIN Rankings r ON u.Name = r.University AND r.Year = 2024
        WHERE r.Ranking != \"Not Ranked\"
        ORDER BY r.Ranking;
    `;

    if (searchQuery) {
        sql = `
            SELECT u.*, r.Ranking
            FROM Universities u
            LEFT JOIN Rankings r ON u.Name = r.University AND r.Year = 2024
            WHERE u.Name LIKE ? AND r.Ranking != \"Not Ranked\"
            ORDER BY r.Ranking;
        `;
    }

    db.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Error during database query:', err);
            return res.status(500).send("Database error");
        }
        res.render('index', { universities: results, username: req.session.username, searchQuery: searchQuery });
    });
});

router.post('/add-favorite', (req, res) => {
    if (!req.session.username) {
        res.redirect('/login');
        return;
    }

    const username = req.session.username;
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
