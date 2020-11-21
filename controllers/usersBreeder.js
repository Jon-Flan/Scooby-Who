//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//uuid
const { v4: uuidv4 } = require('uuid');

//used to validate emails
const validator = require("email-validator");

//breeder sign up page
exports.breederSignUp = function (req, res){
    //can only create an account if not already loggged in
    if(req.session.loggedin){
        res.redirect('/')
    }else{
        res.render("breederSignUp");
    }
    //res.end();
}

//receives a new user via POST:/users
exports.storeBreeder = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    //test user input again if somehow a mallicous entry also validate email address
    var reg = new RegExp ("^[A-Za-z0-9#!@?&*]+$");
    var emailOk = validator.validate(email);
    var passwordOk = reg.test(password);
    var usernameOk = reg.test(username);

    //if password and email were sanitized correctly
    if(passwordOk && emailOk && usernameOk){
        //find if that user email or username already exists
        user = await DB.users.findOne({where: {email: email}});
        user = await DB.users.findOne({where: {username: username}});

        if (user===null){
            //if it doesn't then hash the password and pass all the details to the DB
            crypto.hashPass(password, function(hash){
                newUser = DB.users.build(req.body);
                newUser.uuid = uuidv4();
                newUser.username = username;
                newUser.password = hash;
                newUser.user_type = 'B';
                newUser.save();
            });
            //if everything is ok redirect to the home page
            res.redirect('/');
        }else{
            //otherwise redirect back to the sign_up page and incriment the signup limiter (to be implimented)
            res.redirect('/sign_up');
        }
    }
}