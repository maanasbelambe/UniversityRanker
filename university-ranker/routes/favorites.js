const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/favorites', (req, res) => {
    const username = req.session.username;

    if (!username) {
        res.redirect('/login');
        return;
    }

    const favoritesSql = `
        SELECT f.University, s.Name AS SubjectName
        FROM Favorites f
        JOIN Universities u ON f.University = u.Name
        JOIN OfferedSubjects os ON u.Name = os.University
        JOIN Subjects s ON os.Subject = s.Name
        WHERE f.Username = ?
        ORDER BY f.University, s.Name;
    `;

    db.query(favoritesSql, [username], (err, favoritesResults) => {
        if (err) {
            console.error('Error during database query for favorites:', err);
            return res.status(500).send("Database error fetching favorites");
        }
        const organizedFavorites = formatFavorites(favoritesResults);

        res.render('favorites', { favorites: organizedFavorites });
    });
});

function formatFavorites(favoritesResults) {
    const favorites = {};
    favoritesResults.forEach(fav => {
        if (!favorites[fav.University]) {
            favorites[fav.University] = {
                University: fav.University,
                Subjects: []
            };
        }
        favorites[fav.University].Subjects.push(fav.SubjectName);
    });
    return favorites;
}

module.exports = router;