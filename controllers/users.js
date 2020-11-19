//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//uuid
const { v4: uuidv4 } = require('uuid');

//receives a new user via POST:/users
exports.store = async function(req, res) {
    var password = req.body.password;

    //test user input again if somehow a mallicous entry also validate email address
    var reg = new RegExp ("^[A-Za-z0-9#!@?&*]+$");
    var passwordOk = reg.test(password);

    //if password was sanitized correctly
    if(passwordOk){
        user = await DB.users.findOne({where: {email: req.body.email}});
        if (user===null){
            crypto.hashPass(password, function(hash){
                newUser = DB.users.build(req.body);
                newUser.uuid = uuidv4();
                newUser.password = hash;
                newUser.save();
            });
        }else{
            res.redirect(409, '/');
        }
    }
}

//renders the form to create a new user via GET:/users
exports.create = function(req, res){
    //can only create an account if not already loggged in
    if(req.session.loggedin){
        res.redirect('/')
    }else{
        res.render("SignUp");
    }
    res.end();
}

//updates a userprofile via PUT:/users/:uuid
exports.update = async function(req, res) {
    //searches for the user by the uuid passed via the header
    user = await DB.users.findOne({where: { uuid: req.params.uuid }});

    //if no user was found with that uuid then returns not found
    if (user===null){
        res.redirect(404, '/profile');
    } else {
        //if the id retrieved from the DB isn't the same as the logged in ID, also returns a forbiden
        if (user.id!=req.session.id) {
            res.redirect(403, '/profile');
        } else {
            //if the password was provided then have to set our model password the save as the passed password
            if (req.body.password!=null) {
                //test user input again if somehow a mallicous entry also validate email address
                var reg = new RegExp ("^[A-Za-z0-9#!@?&*]+$");
                var passwordOk = reg.test(password);

                //if password was sanitized correctly 
                if (passwordOk) {
                    //hasing the passed password
                    crypto.hashPass(req.body.passwod, function(hash){
                        user.password = hash;
                    });
                }
            }
            //if user_type was passed, it must be either B (breeder) or C (customer)
            if (req.body.user_type=='B' || req.body.user_type=='C') 
                user.user_type = req.body.user_type;

            user.save();
        }
    }
}