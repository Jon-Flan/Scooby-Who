//imports
const helmet = require("helmet");

//initialize .env file
require('dotenv').config();//set to default .env but can also be {path: "path/filename"}

function security(app){
    //helmet security settings import from env
    process.env.PROXYTRUST;
    process.env.POWEREDBY;
    process.env.FRAMEGUARD;
    process.env.XSS;
    process.env.NOSNIFF;
    process.env.IE;
    process.env.DNS;

    //setting content security policies
    app.use(helmet.contentSecurityPolicy({directives:{
        defaultSrc:["'self'"],
        scriptSrc:["'self'",'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'],
        styleSrc:["'self'", "'unsafe-inline'",
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', 
            'https://fonts.googleapis.com/'],
        fontSrc:["'self'", 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/',
            'https://fonts.gstatic.com/s/nunito/']
    }}));
}

module.exports = security