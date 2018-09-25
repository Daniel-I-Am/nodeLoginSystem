db = require("./database.js");

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
        saveUser(data)
    });
}

function saveUser(data) {
    let username = data.username,
        password = data.password;
    if (!username || !password) {
        callback('application/json', '{"error": "Username or password not provided"}')
        return;
    }
    // once again, set a timeout callback, we cancel that if everything's handled properly
    var timeout = setTimeout(function() {
        callback('application/json', '{"error": "timeout"}')
    }, 1000)
    // start DB interaction
    db.serialize(function() {
        // use some SQL magic to insert a new value into the table, but if the ID already exist, replace the existing save slot
        let stmt = db.prepare("INSERT OR REPLACE INTO users (name, password) VALUES (?, ?)");
        // execute prepared statement with our data
        stmt.run(username, password);
        // finish up query
        stmt.finalize();
        // cancel callback
        clearTimeout(timeout);
        // report back that there's no error in JSON
        callback('application/json', '{"error": null}');
    });
}

module.exports = {"register": register}