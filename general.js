const db = require('./database.js').database;

function checkLogin(user, token, callback) {
    var timeout = setTimeout(function() {
        // call function with false to indicate failed token
        callback(false);
    }, 1000)
    // start DB interaction
    db.serialize(function () {
        // find all records with the provided userID and return them as JSON
        db.each("SELECT * FROM tokens WHERE username='" + user + "' AND token='" + token + "'", function(err, row) {
            clearTimeout(timeout);
            if (err == null) {
                callback(true)
            } else {
                // if there's some kind of error, return the error as JSON
                calback(null)
            }
        });
    });
}

module.exports = {"checkLogin": checkLogin};