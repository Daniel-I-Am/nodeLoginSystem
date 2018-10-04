// import sqlite3 module in verbose mode (for stacktraces)
const sqlite3 = require('sqlite3').verbose();
// point to the database
var db = new sqlite3.Database('./database.sqlite3');

async function insert(table, dataObject, callback) {
    // set a timeout return, we cancel that if everything's handled properly
    var timeout = setTimeout(function() {
        callback(null, "timeout");
    }, 1000)
    // start DB interaction
    await db.serialize(function() {
        // use some SQL magic to insert a new value into the table, but if the ID already exist, replace the existing save slot
        let stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (${
            function() {let toRet = ""; Object.keys(dataObject).forEach(key => toRet += ", " + key); return toRet.substring(2);}()}) VALUES (${
                function() { let toRet = ""; Object.keys(dataObject).forEach(key => toRet += ", ?"); return toRet.substring(2);}()})`);

        // execute prepared statement with our data
        stmt.run(...Object.values(dataObject));
        // finish up query
        stmt.finalize();
        // cancel callback
        clearTimeout(timeout);
        // report back that there's no error in JSON
        callback(null, null);
    });
}

async function select(table, returnArray, dataObject, callback) {
    // set a timeout return, we cancel that if everything's handled properly
    var timeout = setTimeout(function() {
        // return a json with error message
        callback(null, "timeout");
    }, 1000)
    // start database interaction
    await db.serialize(function() {
        // find all records with the provided userID and return them as JSON
        db.all(`SELECT ${returnArray.toString()} FROM ${table} WHERE ${
            function() {let toRet = ""; Object.keys(dataObject).forEach(key => toRet += ", " + key + "=?"); return toRet.substring(2);}()
        }`,Object.values(dataObject),(err, rows) => {
            // process rows here 
            clearTimeout(timeout);
            if (err == null) {
                callback(rows, null);
            } else {
                // if there's some kind of error, return the error as JSON
                callback(null, err.message);
            }
        });
    });
}

async function execute(sql, params, callback) {
    // set a timeout return, we cancel that if everything's handled properly
    var timeout = setTimeout(function() {
        // return a json with error message
        callback(null, "timeout");
    }, 1000)
    // start database interaction
    await db.serialize(function() {
        // find all records with the provided userID and return them as JSON
        db.all(sql,params,(err, rows) => {
            // process rows here 
            clearTimeout(timeout);
            if (err == null) {
                callback(rows, null);
            } else {
                // if there's some kind of error, return the error as JSON
                callback(null, err.message);
            }
        });
    });
}

function close() {
    db.close();
}

module.exports = {"database": db, "select": select, "execute": execute, "insert": insert, "close": close}