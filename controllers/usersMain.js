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
            res.render('login',{unAuth: "true"});
        } else {            
            //compares the password provided by the user with the password from the database
            bcrypt.compare(oldPassword, user.password, function(err, result){
                //if comparison successful, then hashes new password and sets it to the model
                if (result){
                    crypto.hashPass(newPassword, function(hash){
                        user.password = hash;
                    });
                    //saves new password
                    user.save();
                }
            });
        }
    } else {
        res.render('login',{unAuth:"true"});
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