const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.sqlite3');

db.serialize(function () {
    if (process.argv[2] == "c") { db.run('CREATE TABLE saves (id INT, content TEXT)'); }
    var stmt = db.prepare('INSERT INTO saves (id, content) VALUES (?, ?)');

    for (let i = 0; i < 10; i++) {
        stmt.run(i.toString(), "someText" + i.toString());
    }

    stmt.finalize();
})

db.close()