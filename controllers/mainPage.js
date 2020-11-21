//models
var DB = require('../models');

//functionality for the home page
exports.homePage = async function(req,res){
    //if thr user session is marked as logged in or not
    if(req.session.loggedin){
         //if logged in then the uuid should be present, search for that users details  
        user = await DB.users.findOne({where: { uuid: req.session.uuid }});
        //remder the home page with their profile details
        res.render('index',{user});
        res.end();
    }else{
        //otherwise set the user to null
        user = null;
        //render the home page with a null user
        res.render('index',{user});
        res.end();
    }
}