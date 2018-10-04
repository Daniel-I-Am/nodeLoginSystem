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

// exports
module.exports = {"guid": guid}