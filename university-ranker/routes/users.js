// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Render the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle user registration
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO Users (Username, Password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error during database insert:', err);
            return res.status(500).send("User registration failed");
        }
        res.send("User registered successfully!");
    });
});

// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle user login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error during database query:', err);
            return res.status(500).send("Login failed");
        }
        if (result.length > 0) {
            res.send("Logged in successfully!");
        } else {
            res.send("Username or password is incorrect");
        }
    });
});

module.exports = router;
