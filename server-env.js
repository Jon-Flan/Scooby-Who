//initialize .env file
require('dotenv').config();//set to default .env but can also be {path: "path/filename"}

//module imports
const express = require("express");
const bodyParser = require("body-parser");
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

//initialize server
const server = require("./config/server");
server(app);

// Use body parser for parsing text, default parse limit is set to 100kb
app.use(bodyParser.urlencoded({extended: true}));

//import and initialize rate limiter 
const limiter = require('./config/rateLimit');
app.use(limiter.refreshLimit);
//app.use('/login',limiter.loginLimit); //not working!!!!

//app routes
app.use(require("./routes/routes"))


