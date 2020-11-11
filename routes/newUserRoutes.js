//imports
const express = require('express');
const router = express.Router();
const validator = require("email-validator");
const { v4: uuidv4 } = require('uuid');

//import database file
const db = require('../config/db');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//import and initialize rate limit class 
const Limit = require('../config/rateLimit');
var l = new Limit.rateLimit();

var refreshLimit = l.initialLimit; //set to 100 


//creating an account page
router.get('/sign_up',refreshLimit,function(req,res){
    //can only create an account if not already loggged in
    if(req.session.loggedin){
        res.redirect('/')
    }else{
        res.render("SignUp");
    }
    res.end();
});

//route for creating a standard account
router.post('/newUser',refreshLimit,async(req,res) =>{
    var password = req.body.password;
    var email = req.body.email;
    var uuid = uuidv4();

    //test user input again if somehow a mallicous entry also validate email address
    var reg = new RegExp ("^[A-Za-z0-9#!@?&*]+$");

    var result1 = validator.validate(email);
    var result2 = reg.test(password);

    //check if email and password have been entered
    if(email && password){
        //check if secondary regex test is passed
        if(result1 == true && result2 == true){
            //check the database for already existing user with that email
            db.userCheck(email,function(err,userDetails){
                //if user already exists
                if(userDetails != null){
                    //user already exists
                    res.redirect('/');
                }else{
                    //if user doesn't exist, generated the salted password, add the user in DB and send verification email
                    crypto.hashPass(password,function(hash){
                        db.addStandardUser(uuid,email,hash);
                    });

                    res.redirect('/login');
                }
            });
        } 
    }              
})


module.exports = router