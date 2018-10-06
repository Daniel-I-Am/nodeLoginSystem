// import local libs
const db = require("./database.js");
const general = require("./general.js");

// import node modules
const sha256 = require("js-sha256");

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

            // get the plain text password sent over the wire
            let plainTextPassword = post.password;
            // select the salt that should be stored in the DB
            db.select("users", ["salt"], {"username": post.username}, async function(data, err) {
                // Incorrect username
                if (data.length == 0) {
                    callback('application/json', JSON.stringify({"error": "Username or password incorrect"}))
                }
                // get the salt that was selected
                salt = data[0].salt
                // hash and salt the password with the selected salt
                let password = sha256.sha256(salt+plainTextPassword);
                // select every detail about the user if the username AND hashed/salted password match
                db.select("users", ["rowid", "*"], {"username": post.username, "password": password}, async function(data, err) {
                    // incorrect password
                    if (data.length == 0) {
                        callback('application/json', JSON.stringify({"error": "Username or password incorrect"}))
                    // login details are correct
                    } else {
                        // if there's an error in the query, return it
                        if (err) {
                            callback('application/json', JSON.stringify({"error": err.message}))
                        // no error, all was fine
                        } else {
                            // delete the password and salt from the data[0] object, the client side does not need to know those
                            delete data[0].password;
                            delete data[0].salt;
                            // generate a login token and append it onto the data[0] object
                            data[0].token = general.guid();
                            // insert the new token and userID into the tokens table
                            db.insert("tokens", {"userID": data[0].rowid, "token": data[0].token}, function(_, err) {
                                if (err) {
                                    // return if there were any errors
                                    callback('application/json', JSON.stringify({"error": err.message}))
                                } else {
                                    // return the data, login successful
                                    callback('application/json', JSON.stringify(data[0]))
                                }
                            // true === canOverwrite (in DB.insert)
                            }, true); // \db.insert
                        }
                    }
                }); // \db.select
            }); // \db.select
        } catch(err) {
            // if the original salt selection or anything else going on in the function failed somehow, return the error
            callback('application/json', JSON.stringify({"error": err.message}))
        }
    });
}

function logout(request, callback) {
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
            var post = JSON.parse(body);
            db.delete("tokens", {"username": post.username, "token": post.token}, async function(data, err) {
                if (err) {
                    callback('application/json', JSON.stringify({"error": err}));
                } else {
                    callback('application/json', JSON.stringify({"error": null}));
                }
            });
        } catch(err) {
            callback('application/json', JSON.stringify({"error": err.message}));
        }
    });
}

// exports
module.exports = {"login": login, "logout": logout}