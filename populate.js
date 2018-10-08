const CMDLineArgs = parseCMDLine();
// import sqlite
const sqlite3 = require('sqlite3').verbose();
// open DB
var db = new sqlite3.Database('./database.sqlite3');

// start DB interactionn
db.serialize(function () {
    // if we parse a `d` value, drop current table
    if (CMDLineArgs.flags.includes('d')) {
        db.run('DROP TABLE games');
        db.run('DROP TABLE users');
        db.run('DROP TABLE tokens');
    }
    // if we parse a `c` value, create new table
    if (CMDLineArgs.flags.includes('c')) {
        db.run('CREATE TABLE games (userID INTEGER NOT NULL, data TEXT)');
        db.run('CREATE TABLE tokens (userID INTEGER UNIQUE PRIMARY KEY NOT NULL, token TEXT NOT NULL)');
        db.run('CREATE TABLE users (username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, salt TEXT NOT NULL)');
    }
})

// close DB connection
db.close();

function parseCMDLine() {
    flags = []
    args = []
    options = {}
    process.argv.forEach((e, i) => {
        if (i < 2) return;
        if (e.startsWith("-") && !e.startsWith("--")) {
            flags = flags.concat(e.substring(1).split(""));
            return;
        }
        if (e.startsWith("--") && e.includes("=")) {
            options[e.substring(2).split("=")[0]] = e.substring(2).split("=")[1];
            return;
        }
        args = args.concat(e);
    });
    return {"flags": flags, "args": args, "options": options}
}