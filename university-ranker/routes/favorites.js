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
        SELECT f.University, s.Name AS SubjectName, s.25_Salary, s.50_Salary, s.75_Salary
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

        const eliteUniversities = db.query('CALL GetEliteUniversities()')

        res.render('favorites', { favorites: organizedFavorites, elite: eliteUniversities });
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
        favorites[fav.University].Subjects.push({
            SubjectName: fav.SubjectName,
            '25_Salary': fav['25_Salary'],
            '50_Salary': fav['50_Salary'],
            '75_Salary': fav['75_Salary'],
        });
    });
    return favorites;
}

module.exports = router;