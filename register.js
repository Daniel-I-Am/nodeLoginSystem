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
            await registerDB(post.username, post.password, callback)
        } catch(err) {
            callback('application/json', JSON.stringify({"error": err.message}))
        }
    });
}

async function registerDB(username, password, callback) {
    let salt = "asd"
    try {
        db.insert("users", {"username": username, "password": password, "salt": salt}, 
            function(data,err) {callback('application/json', JSON.stringify(err ? {"error": err.message} : {"data": data}))}, false);
    } catch(err) {
        callback('application/json', JSON.stringify({"error": err.message}));
    }
}

module.exports = {"register": register}