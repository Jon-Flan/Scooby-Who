//sequelize import
const { Op } = require("sequelize");

//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//uuid
const { v4: uuidv4 } = require('uuid');

//used to validate emails
const validator = require("email-validator");

//class for sending emails
const Mailer = require("../config/mailer");

//to catch sequelize errors
const {ValidationError} = require('sequelize');

//breeder sign up page
exports.breederSignUp = function (req, res){
    //can only create an account if not already loggged in
    if(req.session.loggedin){
        res.redirect('/')
    }else{
        res.render("breederSignUp",{AccExists: false});
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
        user = await DB.users.findOne({
            where:{
                [Op.or]:[
                    {email: email},
                    {username:username}
                ]
            }
        });


        if (user===null){
            //if it doesn't then hash the password and pass all the details to the DB
            crypto.hashPass(password, function(hash){
                newUser = DB.users.build(req.body);
                newUser.uuid = uuidv4();
                newUser.username = username;
                newUser.password = hash;
                newUser.user_type = 'B';
                newUser.save();

                //sending a welcome e-mail so user can activate their account
                var mailer = new Mailer();
                mailer.sendWelcomEmail(newUser.uuid, newUser.email);
            });
            //if everything is ok render the SignUp page with pop up message of verification
            res.render('SignUp',{verify: true});
        }else{
            //otherwise redirect back to the sign_up page and incriment the signup limiter (to be implimented)
            res.render("breederSignUp",{AccExists: true});
        }
    }
}

//to be accessed via GET:/breeders/profile
//only call inside the middleware /config/auth/isLoggedIn
exports.profile = function(req, res){
    //selects the breeder profile based on the user.id (which is saved in our session from login)
    var profile = DB.breeders.findOne({where: {user_id: req.session.user.id}});
    //renders profile page with the profile object (the profile object might be null)
    res.render("breeder-profile", {profile});
}

//to be accessed via PUT:/breeders/profile
//only call inside the middleware /config/auth/isLoggedIn
exports.updateProdile = async function(req, res){
    try {
        //if user is not a breeder, then returns not authorized and the user profile page
        if (req.session.user.user_type!='B')
            res.status(403).render("user-profile", {prifle: null});
        profile = await DB.breeders.findOne({where: {user_id: req.session.user.id}});
        //if profile doesn't exists yet, then creates a new one from the scratch
        if (profile===null) {
            profile = DB.breeders.build(req.body);
            profile.user_id = req.session.user.id;
        } 
        //if it does exist only update a few fields
        else {
            profile.mobile_phone = req.body.mobile_phone;
            profile.address_1 = req.body.address_1;
            profile.address_2 = req.body.address_2;
            profile.county = req.body.county;
            profile.post_code = req.body.post_code;
        }
        await profile.save();
        //re-rendering the profile page
        res.render("breeder-profile", {profile});
    } catch(e){
        //if error was a validation then status must be 400 and the error can be passed to be shown to the user
        if (e instanceof ValidationError) {
            res.status(400).render("breeder-profile", {e});    
        }
        //if not it's an internal error and user shouldn't have access to it
        else {
            res.status(500).render("breeder-profile");       
        }

        
    }
}