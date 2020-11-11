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

//function to check for the users email in database and return user details
function userCheck(email, data){
	connection.query(`SELECT * FROM users WHERE email = '${email}'`,[email],function(error,results, fields){
		if(results.length > 0){
			var user = results;
			data(error,user);
		}else{
			data(error, null);
		}	
	});
}


//function to add a user with uuid, email & hashed password to db and send verification email
function addStandardUser(uuid,email,password){
	connection.query(`INSERT INTO users (uuid, username, email, mobile_phone, name, surname, password) 
					VALUES('${uuid}', 'testUSer', '${email}','0864321789','John','Joe','${password}')`,[uuid,email,password]);
}
module.exports = {initDB, connect, userCheck,addStandardUser};