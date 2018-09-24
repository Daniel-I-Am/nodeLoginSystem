// import sqlite
const sqlite3 = require('sqlite3').verbose();
// open DB
var db = new sqlite3.Database('./database.sqlite3');

// start DB interactionn
db.serialize(function () {
    // if we parse a `d` value, drop current table
    if (process.argv[2] == "d" || process.argv[2] == "cd" || process.argv[2] == "dc") { db.run('DROP TABLE saves'); }
    // if we parse a `c` value, create new table
    if (process.argv[2] == "c" || process.argv[2] == "cd" || process.argv[2] == "dc") { db.run('CREATE TABLE saves (id INT UNIQUE, content TEXT)'); }

    // prepare insert statement
    var stmt = db.prepare('INSERT INTO saves (id, content) VALUES (?, ?)');

    // fill database with random data
    for (let i = 0; i < 10; i++) {
        stmt.run(i.toString(), "someText" + i.toString());
    }

    // finalize query
    stmt.finalize();
})

// close DB connection
db.close()