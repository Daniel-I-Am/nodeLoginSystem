const CMDLineArgs = require("./parser.js");
// load HTTP module
const http = require("http");
// import fs and module
const fs = require("fs");
// import our own methods
const db = require("./database.js");
const login = require("./login.js");
const register = require("./register.js");
// define on which hostname and port the server will run on
const hostname = CMDLineArgs.options.hostname || '127.0.0.1';
const port = CMDLineArgs.options.port || 8080;

// create HTTP server and listen on port 8080 for requests
const server = http.createServer((req, res) => {
    // set the response HTTP header with HTTP status and Content type
    // in laymans terms, say that the server can handle the request properly
    res.statusCode = 200;

    // get the requested URL
    let url = req.url;
    // split the file up to get everything *before* the GET params
    let path = url.split("?")[0];
    // check if it ends with /` and append index.html
    if (path.endsWith("/")) {
        path = path + "index.html";
    }
    // check if file exists, if so, serve it, otherwise server something that needs to be processed server side
    if (fs.existsSync(__dirname + "/public-html" + path)) {
        // log connection details on server side
        log(req, res);
        // set header to the right type so browser interprets it as proper file
        res.setHeader('Content-Type', function() { 
            let splitArr = (__dirname + "/public-html" + path).split(".");
            switch(splitArr[splitArr.length-1]) {
                case "html":
                    return 'text/html';
                case "css":
                    return 'text/css';
                case "js":
                    return 'text/js';
                case "json":
                    return 'application/json';
                case "ico":
                    return 'image/ico';
                default:
                    return 'text/plain';
            }
        }());
        // send content of file
        res.end(fs.readFileSync(__dirname + "/public-html" + path));
    } else {
        // node API callback function
        callback = function(code, type, response) {res.statusCode = code; res.setHeader('Content-Type', type); res.end(response);}
        // define methods based on path extensions
        let methods = {"register": register.register, "login": login.login, "logout": login.logout}
        
        // loop through methods
        for (let e in methods) {
            // if it's a match, call method and respond
            if (path.endsWith(e)) {
                // log connection details on server side
                async function callFunc() {methods[e](req, callback)}

                callFunc()
                    .then(function() {log(req, res)})
                    .catch(function(err) {
                        res.statusCode = 500;
                        log(req, res);
                        callback(500, 'application/json', JSON.stringify({"error": err.message}))
                    });
                return;
            }
        }
        res.statusCode = 404;
        // log connection details on server side
        log(req, res);
        res.setHeader('Content-Type', 'text/plain');
        res.end("Sorry, we could not process your request. Resource `" + path + "` not understood.");
    }
});

// listen for request on port 8080, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// if we call a `SIGINT` (ctrl-c) event on the server, we catch that signal and handle it ourselves
process.on('SIGINT', function() {
    console.log("\nCaught interrupt signal");
    console.log("Closing server...");
    // close the server safely
    server.close();
    console.log("Closing database connection...");
    // use the imported method to close the DB connection after the server has been brought down
    db.close();
    // o/
    console.log("Goodbye");
    // quit
    // only a little bit redundant
    process.exit();
});

function log(req, res) {
    let d = new Date();
    let color = function() { // define a new anonymous function
        switch (res.statusCode) { // which switches the status code
            case 200: // and based on the statusCode returns a certain color code
            case 201:
            case 202:
                return "\x1b[32m"; // green = OK
            case 403:
            case 401:
            case 405:
                return "\x1b[31m"; // red = Forbidden/Unauthorized/Method Not Allowed
            case 400:
            case 404:
                return "\x1b[33m"; // yellow = Not Found/Bad Request
            case 500:
                return "\x1b[41m\x1b[37m"; // white on red = Internal Server Error
            default: // returns reset by default
                return "\x1b[0m";
        }
    }(); // and gets called, to return the color value, not the function
    console.log(`[${d.toTimeString()}] ${color}${res.socket.remoteAddress}:${res.socket.remotePort} [${res.statusCode}]: ${req.url}\x1b[0m`); //log: [time] ip:port [status]: path
}