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

connection.connect(error => {
    if (error) {
        console.error('Error connecting to the database: ' + error.stack);
        return;
    }
    console.log('Connected to database as ID ' + connection.threadId);
});

module.exports = connection;
