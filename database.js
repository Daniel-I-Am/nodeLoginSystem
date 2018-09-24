var NoSQL = require('nosql');
var db = NoSQL.load('./database.nosql');
 
// db === Database instance <https://docs.totaljs.com/latest/en.html#api~Database>
 
// db.find().make(function(filter) {
//     filter.where('age', '>', 20);
//     filter.where('removed', false);
//     filter.callback(function(err, response) {
//         console.log(err, response);
//     });
// });

function request(url) {
    console.log(url);

    var queryparams = url.split('?')[1];
    var params = queryparams.split('&');

    var pair = null,
        data = [];

    params.forEach(function(d) {
        pair = d.split('=');
        data[pair[0]] = pair[1];
    });
    response = "asd"
    return `{"type": "${data.requestType}", "data": "${data.id}"}`
}

module.exports = {"request": request}