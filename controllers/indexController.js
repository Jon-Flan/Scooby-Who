//models
var DB = require('../models');

//functionality for the home page
exports.homePage = async function(req,res){

        //find all ads in DB 
        adverts = await DB.adverts.findAll({
            where: {
                deleted_at: null
            }
        });


    //if the user session is marked as logged in or not, added functionality from standard auth check in auth.js
    if(req.session.loggedin){

         //if logged in then the uuid should be present, search for that users details  
        user = await DB.users.findOne({
            where: { 
                uuid: req.session.uuid 
            }
        });

        //render the home page with their profile details
        res.render('index',{user, adverts});
        res.end();
    }else{
        //otherwise set the user to null
        user = null;

        //render the home page with a null user
        res.render('index',{user, adverts});
        res.end();
    }
}

exports.filterAds = async function(req,res){
    //get info from filter
    var breed = req.body.breed;
    var price = req.body.price;

    //variables for sorting
    var sort = 'DESC';

    //set the variable for the sort
    if(price === 'High to Low' ){
        sort = 'DESC'
    }else {
        sort = 'ASC'
    }

    //set the all variable for the breed
    if (breed === "All"){
        //find all ads in DB 
        adverts = await DB.adverts.findAll({
            where: {
                deleted_at: null
            },
            order:[
                ['price', sort ]
             ]
        });
        //if not "All" then apply the search criteria
    }else{
            //find all ads in DB 
        adverts = await DB.adverts.findAll({
            where: {
                breed: breed
            },
            order:[
                ['price', sort ]
            ]
        });
    }


    //if the user session is marked as logged in or not, added functionality for filters
    if(req.session.loggedin){

        //if logged in then the uuid should be present, search for that users details  
       user = await DB.users.findOne({
           where: { 
               uuid: req.session.uuid 
           }
       });
       
       //render the home page with their profile details
       res.render('index',{user, adverts});
       res.end();
   }else{
       //otherwise set the user to null
       user = null;

       //render the home page with a null user
       res.render('index',{user, adverts});
       res.end();
   }
}

//about page
exports.about = async function(req,res){
     //find all ads in DB 
     adverts = await DB.adverts.findAll({
        where: {
            deleted_at: null
        }
    });

    //if the user session is marked as logged in or not, added functionality from standard auth check in auth.js
    if(req.session.loggedin){

        //if logged in then the uuid should be present, search for that users details  
       user = await DB.users.findOne({
           where: { 
               uuid: req.session.uuid 
           }
       });

       //render the about page with their profile details
       res.render('about',{user});
       res.end();
   }else{
       //otherwise set the user to null
       user = null;

       //render the about page with a null user
       res.render('about',{user,adverts});
       res.end();
   }
}
