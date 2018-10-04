// import local libs
const db = require("./database.js");
const login = require("./login.js");

// import node modules
const sha256 = require("js-sha256");

function register(request, callback) {
    let body = '';
    request.on('data', function (data) {
        body += data;
        // too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
    });
    request.on('end', function () {
        try {
            var post = JSON.parse(body)
            // use post['blah'], etc.
            callback('application/json', JSON.stringify({"username": post['username'], "password": post['password']}));
        } catch(err) {
            callback('applcation/json', JSON.stringify({"error": err.message}))
        }
    });
}

module.exports = {"register": register}