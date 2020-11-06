var mysql = require('mysql');//alows access to mysql and connect to our database

//connection details
function initDB(){
	connection = mysql.createConnection({
	host     : process.env.DBHOST,
    user     : process.env.USER,
    password : process.env.PASS,
    database : process.env.DB
});
}

//function to connect to the DB - to be initialised in the routes file
function connect () {
	connection.connect(function(error){
		if(!!error){
			console.log('Error Connecting to database');
		}else{
			console.log('Database connection success');
		}
	});
}

//function to check for the users email in database and return user details for password testing
function userLogin (email, data){
	connection.query(`SELECT * FROM users WHERE email = '${email}'`,[email],function(error,results, fields){
		if(results.length > 0){
			var user = results;
			data(error,user);
		}else{
			console.log(error);
			data(error, null);
		}	
	});
}

//test function to add a hashed password to db
//Need to add a check to see if the email already exists in the Database
//Need to add the sending of email verification for each type of user
function addUser(password){
	connection.query(`INSERT INTO users (uuid, username, email, mobile_phone, name, surname, password) 
					VALUES('12qert', 'testUSer', 'passTest@email','0864321789','John','Joe','${password}')`,[password]);
}
module.exports = {initDB, connect, userLogin,addUser};