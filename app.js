var NoSQL = require('nosql');
var nosql = NoSQL.load('./database.nosql');
 
// db === Database instance <https://docs.totaljs.com/latest/en.html#api~Database>
 
db.find().make(function(filter) {
    filter.where('age', '>', 20);
    filter.where('removed', false);
    filter.callback(function(err, response) {
        console.log(err, response);
    });
});