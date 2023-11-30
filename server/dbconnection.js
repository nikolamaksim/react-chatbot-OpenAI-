const mysql = require('mysql');
var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: "openai_spa"
});
con.connect(function(err){
    if(!err) {
        console.log("Database is connected ... ");
    } else {
        console.log("Error connecting database ... ");
    }
    });
module.exports = con;
