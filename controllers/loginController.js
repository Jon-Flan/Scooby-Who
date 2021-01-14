//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//used to validate emails
const validator = require("email-validator");

//receives email and password via POST:/login, checks if the email exists in the database
//then hashes received password with the password on the DB (which should be hashed already)
exports.loginAttempt = async function(req, res) {
	var email = req.body.email;
    var password = req.body.password;
    
    //test user input again if somehow a mallicous entry also validate email address
    var reg = new RegExp ("^[A-Za-z0-9#!@]+$");
    var emailOk = validator.validate(email);
    var passwordOk = reg.test(password);

    //if email and password provided and the password was sanitized successfully
    if(email && password && passwordOk && emailOk){
    	//looks for a user in the DB with the provided email
    	//using findOne function coz shouldn't be 2 anyways
        //also filtering to look only for activated users
    	user = await DB.users.findOne({where: {email: email, validated_at: {[DB.Sequelize.Op.not]: null}}});

    	//if no user was found with that email, redirect to login with not authorized status
    	if (user===null) {
    		res.render('login',{unAuth: "true"});
    	} else {    		
	    	//compares the password provided by the user with the password from the database
	    	crypto.login(password, user.password, req, async function(){
	    		//if it worked, add the uuid to the session & redirect back to the home page
	    		if (req.session.loggedin){
					req.session.uuid = user.uuid;

					//check if the user has filled in their futher details
					if(user.user_type === "C"){
						userDetails = await DB.customers.findOne({
							where:{
								user_id : user.id
							}
						});
						if(userDetails === null){
							res.redirect('updateProfile')
						}
					}else if(user.user_type === "B"){
						userDetails = await DB.breeders.findOne({
							where:{
								user_id : user.id
							}
						});
						if(userDetails === null){
							res.redirect('updateProfile')
						}
					}
					res.redirect('/');
	    		//if not redirect to login page
				}else
	    			res.render('login',{unAuth:"true"});
	    	});
	    }
    } else {
    	res.render('login',{unAuth:"true"});
    }
}

//to be used via GET:/login, if user is already logged in redirects to the home page
exports.loginPage = function(req, res){
	if(req.session.loggedin){
        res.redirect('/');
    }else{
        res.render("login",{unAuth:"false"});
    }
    res.end();
}

//nullify the session and redirects to the home page
exports.logout = function(req, res){
	if(req.session.loggedin){
		//set the session to null as per documentation
		req.session = null;
		//redirect to  home page logged out
		res.redirect('/');

	}else{
		//redirect to  home page logged out
		res.redirect('/');
	}
	res.end(); 
}