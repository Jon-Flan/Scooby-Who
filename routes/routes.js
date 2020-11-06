const bcrypt = require("bcryptjs");
//imports
var express = require('express');
var router = express.Router();

//import and connect to database
const db = require('../config/db');
db.initDB();
db.connect();

//import the custom bcrypt module as crypto
const crypto = require("../config/auth");

//import and initialize rate limit class 
const Limit = require('../config/rateLimit');
var l = new Limit.rateLimit();

var refreshLimit = l.initialLimit; //set to 10 
var login_limit = l.loginLimit; //set to 3


// Main route, if logged in already redirect to home page else redirect to login page 
router.get('/',refreshLimit,function(req,res){
    if(req.session.loggedin){
        res.render("index");
    }else{
        res.redirect("/login")
    }
    res.end();
});

// Test route for testing routes work
router.get('/test',refreshLimit,function(req,res){
    res.render("test");
    res.end();
});

router.get('/login',function(req,res){
    res.render("login");
    res.end();
});


//*************   SIMPLE TEST ROUTES FOR LOGIN AND TESTING BCRYPT!!!! ************************************************************ */

//test route for login flow
router.post('/log', login_limit,function(req,res){
    var email = 'passTest@email';//login test will only work with this user for bcrypt, must be a hashed password!
    var password = 'password'; //correct password is password, anything else should return to login page

    //if email and password provided
    if(email && password){
        //check for the email in the DB and return the user info
        db.userLogin(email, function(err,userDetails){ 
            //check the users password
            console.log(userDetails[0].password);
            crypto.login(password,userDetails[0].password,req,function(error,cb){
                if(req.session.loggedin){
                    res.redirect('/');
                }else{
                    res.redirect('/test');
                }
                res.end();
            });
        });
    }
});

router.get('/addUser',function(req,res){
    res.render("addUser");
    res.end();
});

router.post('/newUser',async(req,res) =>{
    var password = "password";

            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, function(error, hash){
                   db.addUser(hash);
                });
            });
            res.redirect('/login');
})

/***************************************END OF TESTING ROUTES ********************************************************** */

module.exports = router