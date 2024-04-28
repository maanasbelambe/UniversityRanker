const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const session = require('express-session');

app.use(session({
  secret: 'team032-session-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' }
}));

const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const userRoutes = require('./routes/users');
app.use(userRoutes);

const countryRoutes = require('./routes/countries');
app.use(countryRoutes);

const universityRoutes = require('./routes/universities');
app.use(universityRoutes);

const favoriteRoutes = require('./routes/favorites');
app.use(favoriteRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
