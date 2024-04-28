const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO Users (Username, Password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error during database insert:', err);
            return res.status(500).send("User registration failed");
        }
        req.session.username = username;
        res.redirect('/');
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error during database query:', err);
            return res.status(500).send("Login failed");
        }
        if (result.length > 0) {
            req.session.username = username;
            res.redirect('/');
        } else {
            res.send("Username or password is incorrect");
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

router.post('/update-username', (req, res) => {
    const newUsername = req.body.newUsername;
    const oldUsername = req.session.username;

    if (!oldUsername) {
        res.send("You need to be logged in to update your username.");
        return;
    }

    const sql = "UPDATE Users SET Username = ? WHERE Username = ?";
    db.query(sql, [newUsername, oldUsername], (err, result) => {
        if (err) {
            console.error('Error during database update:', err);
            return res.status(500).send("Failed to update username");
        }
        req.session.username = newUsername;
        res.redirect('/favorites');
    });
});

router.post('/delete-favorite', (req, res) => {
    const username = req.session.username;
    const university = req.body.university;

    if (!username) {
        res.send("You need to be logged in to delete favorites.");
        return;
    }

    const sql = "DELETE FROM Favorites WHERE Username = ? AND University = ?";
    db.query(sql, [username, university], (err, result) => {
        if (err) {
            console.error('Error during database delete:', err);
            return res.status(500).send("Failed to delete favorite");
        }
        res.redirect('/favorites');
    });
});


module.exports = router;
