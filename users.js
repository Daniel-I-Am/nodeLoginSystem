db = require("./database.js");

function register(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', () => {
        callback('text/plain', body);
    });
}

module.exports = {"register": register}