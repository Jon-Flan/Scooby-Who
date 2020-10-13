//imports
var session = require("express-session")

function cookie(app){
    // Use session for identifying logged in user
    app.use(session({
        secret: 'addsomestrinhereforcookiesecret',
        resave: true,
        saveUninitialized: false
    }));
}

module.exports = cookie