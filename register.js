// import local libs
const db = require("./database.js");
const login = require("./login.js");

// import node modules
const sha256 = require("js-sha256");

async function register(request, callback) {
    let body = '';
    request.on('data', function (data) {
        body += data;
        // too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
    });
    request.on('end', async function () {
        try {
            var post = JSON.parse(body)
            // use post['blah'], etc.
            let plainTextPassword = post.password,
                salt = Math.random().toString(36).substring(7);
            let password = sha256.sha256(salt+plainTextPassword);
            await registerDB(post.username, password, salt, callback)
        } catch(err) {
            callback('application/json', JSON.stringify({"error": err.message}))
        }
    });
}

async function registerDB(username, password, salt, callback) {
    try {
        db.insert("users", {"username": username, "password": password, "salt": salt}, 
            function(data,err) {callback('application/json', JSON.stringify(err ? {"error": err.message} : {"data": data}))}, false);
    } catch(err) {
        callback('application/json', JSON.stringify({"error": err.message}));
    }
}

module.exports = {"register": register}