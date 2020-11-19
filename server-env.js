//module imports
const express = require("express");
const bodyParser = require("body-parser");

//require controllers
var loginController = require('./controllers/login');
var userController = require('./controllers/users');

//initialize .env file
require('dotenv').config();//set to default .env but can also be {path: "path/filename"}
var app = express();

//initialise cookies
const cookie = require("./config/cookie");
cookie(app);

//set view engine & body parser from config
const viewEngine = require("./config/viewEngine");
viewEngine(app);

//initialze helmet security
const security = require("./config/security");
security(app);

//import and connect to database
const db = require('./config/db');
db.initDB();
db.connect();

//initialize server
const server = require("./config/server");
server(app);

// Use body parser for parsing text, default parse limit is set to 100kb
app.use(bodyParser.urlencoded({extended: true}));

//import and initialize rate limit class that will be used as middlewares
const Limit = require('./config/rateLimit');
var l = new Limit.rateLimit();

var refreshLimit = l.initialLimit; //set to 100 
var login_limit = l.loginLimit; //set to 3

//initialize routes

// Main route, all users can visit this page to view adds, certain functionality will not be possible until logged in
app.get('/',refreshLimit,function(req,res){
    res.render('index');
    res.end();
});

//routes related to login
app.post('/login', login_limit, loginController.loginAttempt);
app.get('/login', loginController.loginPage);
app.get('/logout', refreshLimit, loginController.logout);

//routes related to sign_up
app.get('/sign_up', refreshLimit, userController.create);
app.post('/sign_up', refreshLimit, userController.store);

//routes related to user profile
app.put('/users/:uuid', refreshLimit, userController.update);

//invalid routes automatically redirected
app.get('*',function(req,res){
    res.redirect('/');
});

