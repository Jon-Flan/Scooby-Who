const bcrypt = require("bcryptjs");


//Login function for the user
//Checking password1 that is taken from the user and then 
function login(password1, password2, req,cb){

    bcrypt.compare(password1, password2,function(err, result){
        if(result){
            req.session.loggedin = true;
            cb(req.session.loggedin);
        }else{
            console.log(err);
            req.session.loggedin = false;
            cb(err,req.session.loggedin);
        }
    });
}

function hashPass(password,cb){

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, function(error, hash){
            cb(hash);
        });
    });
};

//middleware only called when user is accessing authenticated-only areas
//if user is not logged in, redirects to the homepage
function isLoggedIn(req, res, next){
    if (req.session.loggedin) {
        next();
    }
    else {
        res.render('index', {user: null});
    }
}


module.exports = {login, hashPass, isLoggedIn};