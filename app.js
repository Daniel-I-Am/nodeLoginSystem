// load HTTP module
const http = require("http");
// import fs module
const fs = require("fs");
// import our own methods
const db = require("./database.js")
// define on which hostname and port the server will run on
const hostname = '127.0.0.1';
const port = 8080;

// create HTTP server and listen on port 8080 for requests
const server = http.createServer((req, res) => {
    // set the response HTTP header with HTTP status and Content type
    // in laymans terms, say that the server can handle the request properly
    res.statusCode = 200;
    // define the content type to be JSON, meaning the response should be interpreted as JSON by the browser/application requesting the aapie
    res.setHeader('Content-Type', 'application/json');
    // call the imported request method and give `res.end` (the methods needed to send data to the client) as a callback function, meaning we can use async methods
    let url = req.url;
    let path = url.split("?")[0];
    if (fs.existsSync(path)) {
        console.log("I need to read and send", path)
    } else {
        db.request(req.url, function(response) {res.end(response);});
    }
});

// listen for request on port 8080, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// if we call a `SIGINT` (ctrl-c) event on the server, we catch that signal and handle it ourselves
process.on('SIGINT', function() {
    console.log("\nCaught interrupt signal");
    console.log("Closing server...")
    // close the server safely
    server.close();
    console.log("Closing database connection...");
    // use the imported method to close the DB connection after the server has been brought down
    db.closeDB();
    // o/
    console.log("Goodbye");
    // quit
    process.exit();
});