//models
var DB = require('../models');

//import our custom bcrypt module as crypto
const crypto = require("../config/auth");

//used to generate a token to be send for email verification
const jwt = require('jsonwebtoken');


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

    var oldPassword = req.body.password;
    var newPassword = req.body.new_password;

    //searches for the user by the uuid passed via the header
    //retrieving also not yet activated accounts in case user forgot password b4 activating
    user = await DB.users.findOne({where: { uuid: req.params.uuid }});

    //if no user was found with that uuid then returns not found
    if (user===null){
        res.redirect('/');
    } else {
        //if the id retrieved from the DB isn't the same as the logged in ID, also returns a forbiden
            
        //if old and new passwords were provided then have to set our model password the save as the passed new password
        if ((oldPassword!=null)&&(newPassword!=null)) {
            //test user input again if somehow a mallicous entry 
            var passwordsOk = reg.test(oldPassword)&&reg.test(newPassword);

            //if password and email were sanitized correctly 
            if (passwordsOk) {
                //hasing the passed password
                crypto.hashPass(newPassword, function(hash){
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

exports.activateAccount = async function(req, res){
    jwt.verify(req.params.jwt, process.env.ACCESS_TOKEN, async (err, uuid)=>{
        if (err) res.redirect(500, '/');
        else {
            user = await DB.users.findOne({where: {uuid: uuid, validated_at: null}});
            if (user===null){
                res.redirect(404, '/');
            } else {
                user.validated_at = DB.sequelize.fn('NOW');
                user.save();
                res.redirect('/');
            }
        }
    });
}