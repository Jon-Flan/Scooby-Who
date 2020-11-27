//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");
const bcrypt = require("bcryptjs");

//used to generate a token to be send for email verification
const jwt = require('jsonwebtoken');


//renders the form to create a new user via GET:/users
exports.signup = function(req, res){
    //can only create an account if not already loggged in
    if(req.session.loggedin){
        res.redirect('/')
    }else{
        res.render("SignUp",{verify:false});
    }
    res.end();
}

//to be accessed via GET:/users/change_password generates the page to change password
//only call inside the middleware /config/auth/isLoggedIn
exports.changePassword = function(req, res){
    res.render("change-password",{AccExists: false});
}

//updates a userprofile via PUT:/users/change_password/:uuid
exports.updatePassword = async function(req, res) {
    try {
        var newPassword = req.body.new_password;
        var oldPassword = req.body.old_password;
        
        ////used to sanitize user inputs 
        var reg = new RegExp ("^[A-Za-z0-9#!@?&*]+$");
        var passwordsOk = (reg.test(newPassword)) && (reg.test(oldPassword));

        //if both passwords were provided and they were sanitized successfully
        if(newPassword && oldPassword && passwordsOk){
            //looks for a user in the DB by the UUID passed as a parameter
            user = await DB.users.findOne({where: { uuid: req.params.uuid }});

            //if no user was found with that email, redirect to password change again with not authorized status
            if (user===null) {
                res.status(401).render('login',{unAuth: "true"});
            } else {  
                //compares the password provided by the user with the password from the database
                await bcrypt.compare(oldPassword, user.password, async function(err, result){
                    //if comparison successful, then hashes new password and sets it to the model
                    if (result){
                        await crypto.hashPass(newPassword, async function(hash){
                            //saves new password
                            user.password = hash;
                            await user.save();
                            res.render('change-password');
                        });
                    }
                });
            }
        } 
        //if password failed to sanitize then returs error 400
        else {
            res.status(400).render('change-password');
        }
    } catch(e){
        res.status(500).render('change-password');
    }
}

exports.activateAccount = async function(req, res){
    jwt.verify(req.params.jwt, process.env.ACCESS_TOKEN, async (err, uuid)=>{
        if (err) res.redirect(500, '/');
        else {
            user = await DB.users.findOne({where: {uuid: uuid, validated_at: null}});
            if (user===null){
                res.redirect(404, '/');
            } else {
                user.validated_at = DB.sequelize.fn('NOW');
                user.save();
                res.render('login',{unAuth:"activated"});
            }
        }
    });
}

//to be accessed via GET:/users/profile
//only call inside the middleware /config/auth/isLoggedIn
exports.profile = function(req, res){
    //selects the customer profile based on the user.id (which is saved in our session from login)
    var profile = DB.customers.findOne({where: {user_id: req.session.user.id}});
    //renders profile page with the profile object (the profile object might be null)
    res.render("user-profile", {profile});
}

//to be accessed via PUT:/users/profile
//only call inside the middleware /config/auth/isLoggedIn
exports.updateProfile = async function(req, res){
    try {
        //if user is not a customer, then returns not authorized and the breeder profile page
        if (req.session.user.user_type!='C')
            res.status(403).render("user-profile");
        profile = await DB.customers.findOne({where: {user_id: req.session.user.id}});
        //if profile doesn't exists yet, then creates a new one from the scratch
        if (profile===null) {
            profile = DB.customers.build(req.body);
            profile.user_id = req.session.user.id;
        } 
        //if it does exist only update a few fields
        else {
            profile.mobile_phone = req.body.mobile_phone;
        }
        await profile.save();
        //re-rendering the profile page
        res.render("user-profile", {profile});
    } catch(e){
        //if error was a validation then status must be 400 and the error can be passed to be shown to the user
        if (e instanceof ValidationError) {
            res.status(400).render("user-profile", {e});    
        }
        //if not it's an internal error and user shouldn't have access to internal
        else {
            res.status(500).render("user-profile");       
        }        
    }
}