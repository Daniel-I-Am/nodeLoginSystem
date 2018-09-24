//Load HTTP module
const http = require("http");
const db = require("./database.js")
const hostname = '127.0.0.1';
const port = 8080;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {
    //Set the response HTTP header with HTTP status and Content type
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    db.request(req.url, function(response) {res.end(response);});
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

process.on('SIGINT', function() {
  console.log("\nCaught interrupt signal");
  console.log("Closing server...")
  server.close();
  console.log("Closing database connection...");
  db.closeDB();
  console.log("Goodbye");
  process.exit();
});