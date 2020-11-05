var mysql = require('mysql');//alows access to mysql and connect to our database

//create the connection variable for the database with all arguments for connection
// *** The database is a secure server database and only white listed IP's can connect **
connection = mysql.createConnection({
	host     : process.env.DBHOST,
    user     : process.env.USER,
    password : process.env.PASS,
    database : process.env.DB
});


exports.database = class {

constructor(){
    //blank constructor
}    

connect = connection.connect(function(error){
	if(!!error){
		console.log('Error Connecting to server');
	}else{
		console.log('Connection success');
	}
});

addUser = connection.query("INSERT INTO users (uuid, username, email, mobile_phone, name, surname, password) VALUES('12qert', 'testUSer', 'email@email','0864321789','John','Joe','password');");

}