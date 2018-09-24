/*var NoSQL = require('nosql');
var db = NoSQL.load('./database.nosql');
 
// db === Database instance <https://docs.totaljs.com/latest/en.html#api~Database>

function request(url) {
    console.log(url);

    var queryparams = url.split('?')[1];
    if (queryparams == undefined) return;
    var params = queryparams.split('&');

    var pair = null,
        data = [];

    params.forEach(function(d) {
        pair = d.split('=');
        data[pair[0]] = pair[1];
    });
    response = "asd";
    switch (data.requestType) {
        case "load":
            return loadSaveGame(data.id);
        case "save":
            return saveSaveGame(data.id, data.content);
        default:
            return '{"error": "Cannot understand request type."}';
    }
}

function loadSaveGame(uid) {
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
    return '{"error": "Errored on database extraction"}';
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

module.exports = {"request": request};
*/