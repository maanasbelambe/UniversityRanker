const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/countries/:countryName', (req, res) => {
    const countryName = req.params.countryName;
    const sql = "SELECT * FROM Countries WHERE Name = ?";
    db.query(sql, [countryName], (err, results) => {
        if (err) {
            console.error('Error during database query:', err);
            return res.status(500).send("Database error");
        }
        if (results.length > 0) {
            res.render('countries', { country: results[0] });
        } else {
            res.send("No country found with that name");
        }
    });
});

module.exports = router;
