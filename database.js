// import sqlite3 module in verbose mode (for stacktraces)
const sqlite3 = require('sqlite3').verbose();
// point to the database
var db = new sqlite3.Database('./database.sqlite3');

// define an async function (you'll see this a lot more)
// async just means execution of this function doesn't delay program flow like a normal function would
// thus you can use stuff like sleep (or in our case timeouts)
async function request(url, callback) {
    // log the fact that someone asked for a page
    console.log("User requested", url);

    // split up all GET parameters (the stuff behind a '?' in a link)
    var queryparams = url.split('?')[1];
    if (queryparams == undefined) callback('{"error": "Cannot understand request type."}'); return;
    var params = queryparams.split('&');

    // put all GET params into an array
    var pair = null,
        data = [];

    params.forEach(function(d) {
        pair = d.split('=');
        data[pair[0]] = pair[1];
    });

    // go through all valid `type` GET params
    switch (data.type) {
        // if we want to load data
        case "load":
            return loadSaveGame(data.id, callback);
        // if we want to save new data
        case "save":
            return saveSaveGame(data.id, data.content, callback);
        // if we supply an invalid type
        default:
            return callback('{"error": "Cannot understand request type."}');
    }
}

// function to load data from database
async function loadSaveGame(uid, callback) {
    if (uid == null) return '{"error": "No id specified"}';
    // set a timeout callback, we cancel this if the request is handled
    var timeout = setTimeout(function() {
        // return a json with error message
        callback('{"error": "timeout"}')
    }, 1000)
    // start database interaction
    await db.serialize(function() {
        // find all records with the provided userID and return them as JSON
        db.each("SELECT * FROM saves WHERE id='" + Number(uid) + "'", function(err, row) {
            clearTimeout(timeout);
            if (err == null) {
                callback('{"' + row.id + '": "' + row.content + '"}');
            } else {
                // if there's some kind of error, return the error as JSON
                callback('{"error": "' + err.message + '"}');
            }
        });
    });
}

/// function to save data to database
async function saveSaveGame(uid, data, callback) {
    if (uid == null) return '{"error": "No id specified"}';
    // once again, set a timeout callback, we cancel that if everything's handled properly
    var timeout = setTimeout(function() {
        callback('{"error": "timeout"}')
    }, 1000)
    // start DB interaction
    db.serialize(function() {
        // use some SQL magic to insert a new value into the table, but if the ID already exist, replace the existing save slot
        let stmt = db.prepare("INSERT OR REPLACE INTO saves (id, content) VALUES (?, ?)");
        // execute prepared statement with our data
        stmt.run(Number(uid), data);
        // finish up query
        stmt.finalize();
        // cancel callback
        clearTimeout(timeout);
        // report back that there's no error in JSON
        callback('{"error": null}');
    });
}

// define a function to close the database connection, used in the main app.js file if we ctrl-c the server
function closeDB() {
    db.close()
}

// export the important (and publically availble) methods
module.exports = {"request": request, "closeDB": closeDB};