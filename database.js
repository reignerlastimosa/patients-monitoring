const mysql = require('mysql');

var database = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"devilmaycry26",
    database:"hospital",
    
    
});


module.exports = database;