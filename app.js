// var NoSQL = require('nosql');
// var nosql = NoSQL.load('./database.nosql');
 
// // db === Database instance <https://docs.totaljs.com/latest/en.html#api~Database>
 
// nosql.find().make(function(filter) {
//     filter.where('age', '>', 20);
//     filter.where('removed', false);
//     filter.callback(function(err, response) {
//         console.log(err, response);
//     });
// });

//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
