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
        defaultSrc:["'self'"]
    }}));
}

module.exports = security