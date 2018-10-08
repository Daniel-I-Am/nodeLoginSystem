// import sqlite
const sqlite3 = require('sqlite3').verbose();
// open DB
var db = new sqlite3.Database('./database.sqlite3');

// start DB interactionn
db.serialize(function () {
    // if we parse a `d` value, drop current table
    if (process.argv[2].match(".*d.*")) {
        db.run('DROP TABLE games');
        db.run('DROP TABLE users');
        db.run('DROP TABLE tokens');
    }
    // if we parse a `c` value, create new table
    if (process.argv[2].match(".*c.*")) {
        db.run('CREATE TABLE games (userID INTEGER NOT NULL, data TEXT)');
        db.run('CREATE TABLE tokens (userID INTEGER UNIQUE PRIMARY KEY NOT NULL, token TEXT NOT NULL)');
        db.run('CREATE TABLE users (username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, salt TEXT NOT NULL)');
    }
})

// close DB connection
db.close();