//imports
var session = require("cookie-session")

function cookie(app){
    // Use session for identifying logged in user
    app.use(session({
        secret: 'd69f7f50fd5b4ad987bc2511df3c4a569434f',
        resave: true,
        saveUninitialized: false,
        maxAge: 240 * 60 * 1000 //valid for 4 hours
    }));
}

module.exports = cookie