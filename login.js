// import local libs
const db = require("./database.js");

// import node modules
const sha256 = require("js-sha256");

// function to generate UUID
function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

async function login(request, callback) {
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
            let plainTextPassword = post.password;
            db.select("users", ["salt"], {"username": post.username}, async function(data, err) {
                if (data.length == 0) {
                    callback('application/json', JSON.stringify({"error": "Username or password incorrect"}))
                }
                salt = data[0].salt
                let password = sha256.sha256(salt+plainTextPassword);
                db.select("users", ["*"], {"username": post.username, "password": password}, async function(data, err) {
                    if (data.length == 0) {
                        callback('application/json', JSON.stringify({"error": "Username or password incorrect"}))
                    } else {
                        if (err) {
                            callback('application/json', JSON.stringify({"error": err.message}))
                        } else {
                            delete data[0].password;
                            delete data[0].salt;
                            data[0].token = guid();
                            db.insert("tokens", {"userID": data[0].rowid, "token": data[0].token}, function(_, err) {
                                if (err) {
                                    callback('application/json', JSON.stringify({"error": err.message}))
                                } else {
                                    callback('application/json', JSON.stringify(data[0]))
                                }
                            }, true);
                        }
                    }
                });
            });
        } catch(err) {
            callback('application/json', JSON.stringify({"error": err.message}))
        }
    });
}

// exports
module.exports = {"guid": guid, "login": login}