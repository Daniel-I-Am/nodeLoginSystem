const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.sqlite3');

db.serialize(function () {
})

db.close()