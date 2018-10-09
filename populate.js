const CMDLineArgs = require("./parser.js");
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
        db.run('DROP TABLE monsters');
        db.run('DROP TABLE baseMonsters');
    }
    // if we parse a `c` value, create new table
    if (CMDLineArgs.flags.includes('c')) {
        db.run('CREATE TABLE games (userID INTEGER NOT NULL, data TEXT)');
        db.run('CREATE TABLE tokens (userID INTEGER UNIQUE PRIMARY KEY NOT NULL, token TEXT NOT NULL)');
        db.run('CREATE TABLE users (username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, salt TEXT NOT NULL)');
        db.run('CREATE TABLE monsters (baseMonsterID INTEGER NOT NULL, name TEXT, attack INT, defense INT, speed INT, lvl INT, xp INT)')
        db.run('CREATE TABLE baseMonsters (type TEXT, attack INT, defense INT, speed INT)')
    }
})

// close DB connection
db.close();