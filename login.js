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
                if (err) {
                    callback(500, 'application/json', JSON.stringify({"error": err}));
                    return;
                }
                // Incorrect username
                if (data.length <= 0) {
                    callback(403, 'application/json', JSON.stringify({"error": "Username or password incorrect"}));
                    return;
                }
                // get the salt that was selected
                salt = data[0].salt;
                // hash and salt the password with the selected salt
                let password = sha256.sha256(salt+plainTextPassword);
                // select every detail about the user if the username AND hashed/salted password match
                db.select("users", ["rowid", "*"], {"username": post.username, "password": password}, async function(data, err) {
                    if (err) {
                        callback(500, 'application/json', JSON.stringify({"error": err}));
                        return;
                    }
                    // incorrect password
                    if (data.length == 0) {
                        callback(403, 'application/json', JSON.stringify({"error": "Username or password incorrect"}));
                        return;
                    // login details are correct
                    } else {
                        // if there's an error in the query, return it
                        if (err) {
                            callback(500, 'application/json', JSON.stringify({"error": err.message}));
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
                                    callback(500, 'application/json', JSON.stringify({"error": err.message}))
                                } else {
                                    // return the data, login successful
                                    callback(200, 'application/json', JSON.stringify(data[0]))
                                }
                            // true === canOverwrite (in DB.insert)
                            }, true); // \db.insert
                        }
                    }
                }); // \db.select
            }); // \db.select
        } catch(err) {
            // if the original salt selection or anything else going on in the function failed somehow, return the error
            callback(500, 'application/json', JSON.stringify({"error": err.message}))
        }
    });
}

function checkLogin(username, token, callback) {
    try {
        // select the userID from the users table
        db.select("users", ["rowid"], {"username": username}, async function(data, err) {
            if (err) {
                // report errors
                callback(null, err);
            } else {
                // select the token with the userid from before
                db.select("tokens", ["*"], {"userID": data[0].rowid, "token": token}, async function(data, err) {
                    if (err) {
                        // report errors
                        callback(null, err);
                    } else {
                        // if there's no users by that id and token, we are not logged in properly, return false
                        if (data.length == 0) {
                            callback(false, null);
                        } else {
                            // we are logged in, users userid and token are in the tokens table, return true
                            callback(true, null);
                        }
                    }
                });
            }
        });
    } catch(err) {
        callback(null, err.message);
    }
}

// logout just deletes the token from tokens table
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
            // parse post data
            var post = JSON.parse(body);
            // select userID from users table
            db.select("users", ["rowid"], {"username": post.username}, async function(data, err) {
                if (err) {
                    // report errors
                    callback(500, 'application/json', JSON.stringify({"error": err}));
                } else {
                    if (data.length <= 0) {
                        callback(401, 'application/json', JSON.stringify({"error": "Not logged in"}));
                        return;
                    }
                    // delete our token from the tokens table, if we supply the wrong token, nothing will be removed from the database
                    db.delete("tokens", {"userID": data[0].rowid, "token": post.token}, async function(data, err) {
                        if (err) {
                            // report errors
                            callback(500, 'application/json', JSON.stringify({"error": err}));
                        } else {
                            // report no errors
                            callback(200, 'application/json', JSON.stringify({"error": null}));
                        };
                    });
                };
            });
        } catch(err) {
            callback('application/json', JSON.stringify({"error": err.message}));
        }
    });
}

// exports
module.exports = {"login": login, "logout": logout, "checkLogin": checkLogin};