const db = require("./database.js").database;
const sha256 = require("js-sha256");

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
        let salt = Math.random().toString(36).substring(7);
        console.log("salt", salt);
        saveUser(username, sha256(salt + plainTextPassword), salt)
    });
}

function login(request, callback) {
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
        loadUser(username, plainTextPassword)
    });
}

function saveUser(username, password, salt) {
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
        let stmt = db.prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)");
        // execute prepared statement with our data
        stmt.run(username, password, salt, function (err) {
            clearTimeout(timeout);
            if (err) {
                return callback('text/plain', err.message)
            } else {
                callback('application/json', '{"error": null}');
            }
        });
    });
}

function loadUser(username, plainTextPassword) {
    var timeout = setTimeout(function() {
        // return a json with error message
        callback('application/json', '{"error": "timeout"}')
    }, 1000)
    // start database interaction
    db.serialize(function() {
        // find all records with the provided userID and return them as JSON
        db.each("SELECT salt FROM users WHERE username='" + username + "'", function(err, row) {
            if (err == null) {
                let salt = row.salt;

                // find all records with the provided userID and return them as JSON
                db.each("SELECT * FROM users WHERE username='" + username + "' AND password='" + sha256(salt + plainTextPassword) + "'", function(err, row) {
                    clearTimeout(timeout);
                    if (err == null) {
                        callback('text/plain', 'Login successful')
                    } else {
                        // if there's some kind of error, return the error as JSON
                        callback('application/json', '{"error": "Could not find user"}');
                    }
                });
            } else {
                // if there's some kind of error, return the error as JSON
                callback('application/json', '{"error": "Could not find user"}');
            }
        });
    });
}

module.exports = {"register": register, "login": login}