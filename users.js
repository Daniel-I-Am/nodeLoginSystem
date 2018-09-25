const db = require("./database.js").database;
const bcrypt = require('bcrypt');
const saltRounds = 10;

function register(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', () => {
        let queryparams = body;
        var params = queryparams.split('&');
    
        // put all GET params into an array
        var pair = null,
            data = [];
    
        params.forEach(function(d) {
            pair = d.split('=');
            data[pair[0]] = pair[1];
        });
        let username = data.username,
            plainTextPassword = data.password;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                saveUser(username, hash);
            });
        });
    });
}

function saveUser(username, password) {
    if (!username || !password) {
        callback('application/json', '{"error": "Username or password not provided"}');
        return;
    }
    // once again, set a timeout callback, we cancel that if everything's handled properly
    var timeout = setTimeout(function() {
        callback('application/json', '{"error": "timeout"}');
    }, 1000)
    // start DB interaction
    db.serialize(function() {
        // use some SQL magic to insert a new value into the table, but if the ID already exist, replace the existing save slot
        let stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        // execute prepared statement with our data
        stmt.run(username, password, function (err) {
            clearTimeout(timeout);
            if (err) {
                return callback('text/plain', err.message)
            } else {
                callback('application/json', '{"error": null}');
            }
        });
    });
}

module.exports = {"register": register}