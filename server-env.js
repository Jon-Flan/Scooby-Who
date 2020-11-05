//module imports
const express = require("express");
const bodyParser = require("body-parser");

//initialize .env file
require('dotenv').config();//set to default .env but can also be {path: "path/filename"}
var app = express();

//import and initialize the database connection
const data = require("./config/db");
var db = new data.database();
db.connect;
db.addUser;

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

//initialize routes
app.use(require("./routes/routes"));
