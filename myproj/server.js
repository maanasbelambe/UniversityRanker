var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '35.224.163.116',
                user: 'root',
                password: 'team032-dbsystems',
                database: 'unirankdb'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Add User' });
});

app.get('/success', function(req, res) {
      res.send({'message': 'Added user successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
   
  var sql = `INSERT INTO Users (Username, Password) VALUES ('${username}','${password}')`;



  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

app.get('/api/attendance', function(req, res) {
  var sql = 'SELECT * FROM Users';

  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send({ message: 'Error fetching user data', error: err });
      return;
    }
    res.json(results);
  });
});

app.post('/api/attendance/modify/:username', function(req, res) {
  var username = req.params.username;
  var new_username = req.body.new_username; // Assuming 'present' is sent in the request body

  var sql = 'UPDATE Users SET Username = ? WHERE Username = ?';

  connection.query(sql, [new_username, username], function(err, result) {
    if (err) {
      console.error('Error modifying user record:', err);
      res.status(500).send({ message: 'Error modifying user record', error: err });
      return;
    }
    if(result.affectedRows === 0) {
      // No rows were affected, meaning no record was found with that ID
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send({ message: 'User record modified successfully' });
    }
  });
});

app.delete('/api/attendance/delete/:username', function(req, res) {
  var username = req.params.id;

  var sql = 'DELETE FROM Users WHERE Username = ?';

  connection.query(sql, [username], function(err, result) {
    if (err) {
      console.error('Error deleting user record:', err);
      res.status(500).send({ message: 'Error deleting user record', error: err });
      return;
    }
    if(result.affectedRows === 0) {
      // No rows were affected, meaning no record was found with that ID
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send({ message: 'User record deleted successfully' });
    }
  });
});


app.listen(80, function () {
    console.log('Node app is running on port 80');
});