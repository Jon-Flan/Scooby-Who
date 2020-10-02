// Import all dependancies/libraries needed
var express = require("express");
var session = require("express-session");
var rateLimit = require("express-rate-limit");
var helmet = require ("helmet")
var bodyParser = require("body-parser");
var http = require("http");
var https = require("https");
var bcrypt = require("bcryptjs")
var fs = require("fs");
var tls = require("tls");
var app = express();
var mysql = require('mysql');//alows access to mysql and connect to our database

const { DEFAULT_MIN_VERSION } = require("tls");
const { countReset } = require("console");
const { MemoryStore } = require("express-session");

//create the connection variable for the database with all arguments for connection
// *** The database is a secure server database and only white listed IP's can connect **
var connection = mysql.createConnection({
//database connection details will go here
});

// Create instance of TLSSocket to be able to retrieve the protocol being used
var tlsSocket = new tls.TLSSocket();

// Use session for identifying logged in user
app.use(session({
    secret: '!D0gZat0_dA5h$$_',
    resave: true,
    saveUninitialized: false
}));

// Use body parser for parsing text, default parse limit is set to 100kb
app.use(bodyParser.urlencoded({extended: true}));

// Set the view locations and the view engine used
app.use(express.static("views"));
app.use(express.static("scripts"));
app.use(express.static("images"));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//set reverse proxy to true (This for using Apace as the reverse proxy on the server)
app.set('trust proxy', 1);

// Mask the powered by header to display an incorrect version
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0'}));

// Mitigate clickjacking iframe attacks
app.use(helmet.frameguard({ action: 'deny'}));

// A step to mitigate xss attacks
app.use(helmet.xssFilter());

// Mitigate interferance of the response MIME Type
app.use(helmet.noSniff());

// Prevent IE from downloading untrustworthy HTML
app.use(helmet.ieNoOpen());

// Again forcing https for the desired amount of time (set at 90days)
const maxAgeLimit = 90*24*60*60*1000;
app.use(helmet.hsts({ maxAge: maxAgeLimit, force: true}));

// Disable DNS prefetch (at the cost of slight performance decrease)
app.use(helmet.dnsPrefetchControl());

// Another step to mitigate XSS and script injection attacks, 
// Only allow javascript and resources from specific sources, no inline javascript allowed, 
// Inline styling allowed for Tableau embedded content
app.use(helmet.contentSecurityPolicy({directives:{
//Content Security Directives to be placed here, more will be added through development
defaultSrc:["'self'"]       
}}));

// Set Rate Limiting for initial loading of pages & routes
const initialLimit = rateLimit({
    max: 10,// max requests
    windowMs: 60 * 60 * 1000, // per 1 Hour
    handler: function (req, res) {
            res.status(429).sendFile(__dirname+ '/views/error429.html');
            console.log("Too many requests error");
            },
});

// Set Rate Limiting for initial loading of pages & routes
const loginLimit = rateLimit({
    max: 3,// max requests
    windowMs: 15 * 60 * 1000, // per 15min 
    skipSuccessfulRequests: true,
    handler: function (req, res) {
        res.status(423).sendFile(__dirname+ '/views/error423.html');
        console.log("Login attempts reached: 423");
        },
});

// Load the ssl certificates and set the min accepted TLS to v1.2
var options = {
    hostname: "localhost",
    port: 443,
    path: "/",
    method: "GET",
    DEFAULT_MIN_VERSION: "TLSv1.2",
    key: fs.readFileSync('https/key.pem'),
    cert: fs.readFileSync('https/cert.pem')   
};

// Create https server and listen ports
https.createServer(options, app).listen(443, function(){
    console.log("Server is running correctly, TLS version is: " + tlsSocket.getProtocol()) 
});
// Again making sure to force only https connection
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

//***********************************************************************************************************************//
//***********************************************************************************************************************//
/**  ALL CODE ABOVE IS FOR SETTING AN MAINTAINNG THE SERVER, ANYTHING BELOW IS FOR ROUTES TO PAGES (GET/POST REQUESTS) **/
//***********************************************************************************************************************//
//***********************************************************************************************************************//

//route to login page
app.get('/', function(req,res){
//will cbe route for login page, for now just dummy test
res.send("Dogz App");
});