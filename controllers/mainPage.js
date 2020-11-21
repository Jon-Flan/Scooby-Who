//models
var DB = require('../models');

exports.homePage = async function(req,res){

    if(req.session.loggedin){
         //searches if there is user 
        user = await DB.users.findOne({where: { uuid: req.session.uuid }});

        res.render('index',{user});
        res.end();
    }else{
        user = null;

        res.render('index',{user});
        res.end();
    }
}