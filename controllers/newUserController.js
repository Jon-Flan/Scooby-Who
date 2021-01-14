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
        res.render("SignUp",{verify:false});
    }
    res.end();
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
                res.render('login',{unAuth:"activated"});
            }
        }
    });
}