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
            return await loadSaveGame(data.id, callback);
        case "save":
            return saveSaveGame(data.id, data.content);
        default:
            return '{"error": "Cannot understand request type."}';
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

function saveSaveGame(uid, data) {
    db.insert()
    db.find().make(function(filter) {
        filter.where('id', uid);
        filter.callback(function(err, response) {
            if (err == null) {
                return response;
            } else {
                return '{"error": "' + err + '"}';
            }
        });
    });
    return '{"error": "Errored on database insertion"}';
}

function closeDB() {
    db.close()
}

module.exports = {"request": request, "closeDB": closeDB};