const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.sqlite3');

async function request(url, callback) {
    console.log(url);

    var queryparams = url.split('?')[1];
    if (queryparams == undefined) return '{"error": "Cannot understand request type."}';
    var params = queryparams.split('&');

    var pair = null,
        data = [];

    params.forEach(function(d) {
        pair = d.split('=');
        data[pair[0]] = pair[1];
    });
    response = "asd";
    switch (data.type) {
        case "load":
            return loadSaveGame(data.id, callback);
        case "save":
            return saveSaveGame(data.id, data.content, callback);
        default:
            return callback('{"error": "Cannot understand request type."}');
    }
}

async function loadSaveGame(uid, callback) {
    if (uid == null) return '{"error": "No id specified"}';
    var timeout = setTimeout(function() {
        callback('{"error": "timeout"}')
    }, 1000)
    await db.serialize(function() {
        db.each("SELECT * FROM saves WHERE id='" + Number(uid) + "'", function(err, row) {
            clearTimeout(timeout);
            if (err == null) {
                callback('{"' + row.id + '": "' + row.content + '"}');
            } else {
                callback('{"error": "' + err.message + '"}');
            }
        });
    });
}

async function saveSaveGame(uid, data, callback) {
    if (uid == null) return '{"error": "No id specified"}';
    var timeout = setTimeout(function() {
        callback('{"error": "timeout"}')
    }, 1000)
    db.serialize(function() {
        let stmt = db.prepare("insert or replace into saves (id, content) values (?, ?)");
        stmt.run(Number(uid), data);
        stmt.finalize();
        clearTimeout(timeout);
        callback('{"error": null}');
    });
}

function closeDB() {
    db.close()
}

module.exports = {"request": request, "closeDB": closeDB};