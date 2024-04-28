const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

// Setting up the public directory
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Import routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const userRoutes = require('./routes/users');
app.use(userRoutes);

const countryRoutes = require('./routes/countries');
app.use(countryRoutes);

const universityRoutes = require('./routes/universities');
app.use(universityRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
