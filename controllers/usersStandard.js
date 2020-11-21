//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//uuid
const { v4: uuidv4 } = require('uuid');

//used to validate emails
const validator = require("email-validator");

//standard user sign up page
exports.standardSignUp = function (req, res){
    //can only create an account if not already loggged in
    if(req.session.loggedin){
        res.redirect('/')
    }else{
        res.render("userSignUp");
    }
    //res.end();
}

//receives a new user via POST:/users
exports.storeUser = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    //test user input again if somehow a mallicous entry also validate email address
    var reg1 = new RegExp("^[A-Za-z0-9]+$");
    var reg2 = new RegExp ("^[A-Za-z0-9#!@?&*]+$");
    
    var emailOk = validator.validate(email);
    var passwordOk = reg2.test(password);
    var usernameOk = reg1.test(username);

    //if password and email were sanitized correctly
    if(passwordOk && emailOk && usernameOk){
        user = await DB.users.findOne({where: {email: email}});
        if (user===null){
            crypto.hashPass(password, function(hash){
                newUser = DB.users.build(req.body);
                newUser.uuid = uuidv4();
                newUser.username = username;
                newUser.password = hash;
                newUser.user_type = 'C';
                newUser.save();
            });
            res.redirect('/');
        }else{
            res.redirect('/sign_up');
        }
    }
}