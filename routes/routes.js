//imports
var express = require('express');
var router = express.Router();

//import and initialize the database connection
const data = require("../config/db");
var db = new data.database();
db.connect;
//db.addUser;

//import and initialize rate limit class 
const Limit = require('../config/rateLimit');
var l = new Limit.rateLimit();

var refreshLimit = l.initialLimit; //set to 10 
var login_limit = l.loginLimit; //set to 3


// Main route, if logged in already redirect to home page else redirect to login page 
router.get('/',refreshLimit,function(req,res){
    res.render("index");
    res.end();
});

// Test route for testing routes work
router.get('/test',refreshLimit,function(req,res){
    res.render("test");
    res.end();
});



module.exports = router