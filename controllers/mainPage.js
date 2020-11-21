//models
var DB = require('../models');

exports.homePage = async function(req,res){

    //using findOne function coz shouldn't be 2 anyways
    //searches for the user by the uuid passed via the header
    user = await DB.users.findOne({where: { uuid: req.session.uuid }});

     //if no user was found with that uuid then returns not found
     if (user===null){
        res.redirect('/');
    } else {
        res.render('home', {user});
        res.end();
    }
}