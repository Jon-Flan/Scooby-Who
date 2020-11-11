//imports
const express = require('express');
const router = express.Router();
const validator = require("email-validator");

//import database file
const db = require('../config/db');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//import and initialize rate limit class 
const Limit = require('../config/rateLimit');
var l = new Limit.rateLimit();

var refreshLimit = l.initialLimit; //set to 100 
var login_limit = l.loginLimit; //set to 3

// route for login page
router.get('/login',function(req,res){
    if(req.session.loggedin){
        res.redirect('/');
    }else{
        res.render("login");
    }
    res.end();
});

//login route
router.post('/log_in', login_limit,function(req,res){
    var email = req.body.email;
    var password = req.body.password;

        //test user input again if somehow a mallicous entry also validate email address
        var reg = new RegExp ("^[A-Za-z0-9#!@]+$");
    
        var result1 = validator.validate(email);
        var result2 = reg.test(password)

    //if email and password provided
    if(email && password){
        //and check again that secondary regex check is passed
        if(result1 == true && result2 == true){
             //check for the email in the DB and return the user info
            db.userCheck(email, function(err,userDetails){ 
                //if the user exists
                if(userDetails != null){
                    //compare the hashed password with entered password
                    crypto.login(password,userDetails[0].password,req,function(error,cb){
                        if(req.session.loggedin){
                            //returns logged in true if true and redirect to home page
                            res.redirect('/');
                        }else{
                            //if password incorrect, redirect back to login again (Max 3 attempts)
                            res.redirect('/login');
                        }
                        res.end();
                    });
                }else{
                //if user doesnt exist redirect back to re-attempt login (Max 3 attempts)
                res.redirect('/login'); 
                }  
            });
        }
    }
});

//logout feature to destroy session and redirect to home page
router.get('/logout',refreshLimit, function(req,res){
    if(req.session.loggedin){
        //set the session to null as per documentation
        req.session = null;
        //redirect to  home page logged out
        res.redirect('/');
    }else{
        //otherwise user is already logged out so redirect anyway
        res.redirect('/');
    }
    res.end();
})

module.exports = router