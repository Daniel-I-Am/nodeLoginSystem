// import sqlite
const sqlite3 = require('sqlite3').verbose();
// open DB
var db = new sqlite3.Database('./database.sqlite3');

// start DB interactionn
db.serialize(function () {
    // if we parse a `d` value, drop current table
    if (process.argv[2].match(".*d.*")) {
        db.run('DROP TABLE saves');
        db.run('DROP TABLE users');
    }
    // if we parse a `c` value, create new table
    if (process.argv[2].match(".*c.*")) {
        db.run('CREATE TABLE saves (id INT UNIQUE, user TEXT, content TEXT)');
        db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)');
    }

    // prepare insert statement
    var stmt = db.prepare('INSERT OR REPLACE INTO saves (id, user, content) VALUES (?, ?, ?)');

    // fill database with random data
    let users = ["dan", "kevin", "someother user", "right!!'!!", "');drop table saves;--", "u5", "u6", "u7", "u8", "u9"];
    for (let i = 0; i < 10; i++) {
        stmt.run(i.toString(), users[i], "someText" + i.toString());
    }

    // finalize query
    stmt.finalize();
    
    // prepare insert statement
    var stmt = db.prepare('INSERT OR REPLACE INTO users (username, password) VALUES (?, ?)');

    // fill database with random data
    for (let i = 0; i < 10; i++) {
        stmt.run(users[i], "pass");
    }

    // finalize query
    stmt.finalize();
})

// close DB connection
db.close();