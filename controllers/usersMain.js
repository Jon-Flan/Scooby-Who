//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");


//renders the form to create a new user via GET:/users
exports.signup = function(req, res){
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
    //used to sanitize user inputs (password, mobile phone, etc)
    var reg = new RegExp ("^[A-Za-z0-9#!@?&*]+$");

    //searches for the user by the uuid passed via the header
    user = await DB.users.findOne({where: { uuid: req.params.uuid }});

    //if no user was found with that uuid then returns not found
    if (user===null){
        res.redirect('/');
    } else {
        //if the id retrieved from the DB isn't the same as the logged in ID, also returns a forbiden
            
        //if the password was provided then have to set our model password the save as the passed password
        if (req.body.password!=null) {
            //test user input again if somehow a mallicous entry also validate email address
            var passwordOk = reg.test(password);

            //if password and email were sanitized correctly 
            if (passwordOk) {
                //hasing the passed password
                crypto.hashPass(req.body.passwod, function(hash){
                    user.password = hash;
                });
            }
        }
            
        //if the mobile phone was provided then have to set our model mobile phone the save as the passed mobile phone
        if (req.body.mobile_phone!=null) { 
            //test user input again if somehow a mallicous entry also validate email address
            var phoneOk = reg.test(req.body.mobile_phone);

            //only sets our model mobile phone if the user input was sanitized properly
            if (phoneOk)
                user.mobile_phone = req.body.mobile_phone;
        }

        //if the username was provided then have to set our model username the save as the passed username
        if (req.body.username!=null) { 
            //test user input again if somehow a mallicous entry also validate email address
            var phoneOk = reg.test(req.body.username);

            //only sets our model username if the user input was sanitized properly
            if (phoneOk)
                user.username = req.body.username;
        }

        user.save();

        res.redirect('/');
    }
}