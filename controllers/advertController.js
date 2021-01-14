//models
var DB = require('../models');

const bcrypt = require("bcryptjs");

//controller for creating the adverts page
exports.createAdvert = async function(req,res){
    if(req.session.loggedin){

        //find the user in the users db
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});
        
        if(user.user_type === "C"){
            res.redirect("/");
        }else{
            res.render("createAdd");
        }  
    }else{
        res.redirect("/");
    }res.end();
}

//for POST of advert
exports.uploadAdd = async function(req,res){
    if(req.session.loggedin){
        //find the user in the users db
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});
        
        if(user.user_type === "C"){
            res.redirect("/");
        }else{
            //function to test for empty string or all spaces
            function isEmpty(str){
                return str === null;
            }
            //get the inputs from the form
            var title = req.body.title;
            var dogBreed = req.body.breed;
            var sex = req.body.sex;
            var qty = req.body.qty;
            var desc = req.body.desc;
            var age = req.body.age;
            var price = req.body.price;

            updatedAt = new Date();

            //regex to sanitize input
            var reg = new RegExp ("^[A-Za-z0-9,\-,'+. ]+$");

            //create breeder update to be inserted in DB
            advertCreate = DB.adverts.build(req.body);

            //test title input
            if(!isEmpty(title)){
                var titleOK = reg.test(title);
                //if ok input to DB
                if(titleOK){
                    advertCreate.title = title;
                }
            }
            //test dogBreed input
            if(!isEmpty(dogBreed)){
                var dogBreedOK = reg.test(dogBreed);
                //if ok input to DB
                if(dogBreedOK){
                    advertCreate.breed = dogBreed;
                }
            }
            //test sex input
            if(!isEmpty(sex)){
                var sexOK = reg.test(sex);
                //if ok input to DB
                if(sexOK){
                    advertCreate.sex = sex;
                }
            }
            //test qty input
            if(!isEmpty(qty)){
                var qtyOK = reg.test(qty);
                //if ok input to DB
                if(qtyOK){
                    advertCreate.actual_quantity = qty;
                    advertCreate.original_quantity = qty;
                }
            }
            //test desc input
            if(!isEmpty(desc)){
                var descOK = reg.test(desc);
                //if ok input to DB
                if(descOK){
                    advertCreate.body = desc;
                }
            }
            //test age input
            if(!isEmpty(age)){
                var ageOK = reg.test(age);
                //if ok input to DB
                if(ageOK){
                    advertCreate.age = age;
                }
            }
             //test price input
             if(!isEmpty(price)){
                var priceOK = reg.test(price);
                //if ok input to DB
                if(priceOK){
                    advertCreate.price = price;
                }
            }

            //other advert information
            userDetails = await DB.breeders.findOne({where:{user_id : user.id}})
            breederID = userDetails.id;
            advertCreate.breeder_id = breederID;
            advertCreate.updated_at = updatedAt;
            advertCreate.created_at = updatedAt;

            advertCreate.save();
        } 
        res.redirect("/"); 
    }else{
        res.redirect('/')
    }res.end();
}

//Edit an advert Page
exports.editAdvertPage = async function(req,res){
    if(req.session.loggedin){
        //find the current users details
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        //find the correct advert
        advert = await DB.adverts.findOne({where:{id: req.params.id}});
        //find the breeder
        breederID= advert.breeder_id;
        breeder = await DB.breeders.findOne({where:{ id: breederID}});

        //check that it is the correct breeder who is accessing the advert
        if(user.id != breeder.user_id){
            res.redirect("/")
        }else{
            res.render("editAdd",{advert,user});
        }
    }else{
        res.redirect("/");
    }res.end();
}
//edit an advert
exports.advertEdited = async function(req,res){
    if(req.session.loggedin){
         //find the current users details
         user = await DB.users.findOne({where: {uuid: req.session.uuid}});

         //find the correct advert
         advert = await DB.adverts.findOne({where:{id: req.params.id}});
         //find the breeder
         breederID= advert.breeder_id;
         breeder = await DB.breeders.findOne({where:{ id: breederID}});

         //check that it is the correct breeder who is accessing the advert
         if(user.id != breeder.user_id){
            res.redirect("/")
        }else{
             //function to test for empty string or all spaces
            function isEmpty(str){
                return str === null;
            }
            //get the inputs from the form
            var title = req.body.title;
            var dogBreed = req.body.breed;
            var sex = req.body.sex;
            var qty = req.body.qty;
            var desc = req.body.desc;
            var age = req.body.age;
            var price = req.body.price;

            updatedAt = new Date();

            //regex to sanitize input
            var reg = new RegExp ("^[A-Za-z0-9,\-,'+. ]+$");

            //test title input
            if(!isEmpty(title)){
                var titleOK = reg.test(title);
                //if ok input to DB
                if(titleOK){
                    advert.title = title;
                }
            }
            //test dogBreed input
            if(!isEmpty(dogBreed)){
                var dogBreedOK = reg.test(dogBreed);
                //if ok input to DB
                if(dogBreedOK){
                    advert.breed = dogBreed;
                }
            }
            //test sex input
            if(!isEmpty(sex)){
                var sexOK = reg.test(sex);
                //if ok input to DB
                if(sexOK){
                    advert.sex = sex;
                }
            }
            //test qty input
            if(!isEmpty(qty)){
                var qtyOK = reg.test(qty);
                //if ok input to DB
                if(qtyOK){
                    advert.actual_quantity = qty;
                }
            }
            //test desc input
            if(!isEmpty(desc)){
                var descOK = reg.test(desc);
                //if ok input to DB
                if(descOK){
                    advert.body = desc;
                }
            }
            //test age input
            if(!isEmpty(age)){
                var ageOK = reg.test(age);
                //if ok input to DB
                if(ageOK){
                    advert.age = age;
                }
            }
             //test price input
             if(!isEmpty(price)){
                var priceOK = reg.test(price);
                //if ok input to DB
                if(priceOK){
                    advert.price = price;
                }
            }

            //other advert details
            advert.updated_at = updatedAt;
            //save changes
            advert.save();

            res.redirect('/profile');
        }

    }else{
        res.redirect("/")
    }
}

//Delete and advert
exports.deleteAdvert = async function(req,res){
    if(req.session.loggedin){
         //find the current users details
         user = await DB.users.findOne({where: {uuid: req.session.uuid}});

         //find the correct advert
         advert = await DB.adverts.findOne({where:{id: req.params.id}});
         //find the breeder
         breederID= advert.breeder_id;
         breeder = await DB.breeders.findOne({where:{ id: breederID}});
 
         //check that it is the correct breeder who is accessing the advert
         if(user.id != breeder.user_id){
             res.redirect("/")
         }else{
             res.render("deleteAdd",{advert,user,message:"none"});
         }
    }else{
        res.redirect("/");
    }res.end()
}

//Post for Delete an advert
exports.advertDeleted = async function(req,res){
    if(req.session.loggedin){
        //get the inputs from the form
        var password = req.body.password;

        //test user input again if somehow a mallicous entry also validate email address
        var reg = new RegExp ("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$");
        var passwordOK= reg.test(password);

            //if inputs are ok continue
            if(passwordOK){
                //find the user in the users db
                user = await DB.users.findOne({where: {uuid: req.session.uuid}});

                //find the correct advert
                advert = await DB.adverts.findOne({where:{id: req.params.id}});
                //find the breeder
                breederID= advert.breeder_id;
                breeder = await DB.breeders.findOne({where:{ id: breederID}});

                //check that it is the correct breeder who is accessing the advert
                if(user.id != breeder.user_id){
                    res.redirect("/")
                }else{
                    //compare the password
                    bcrypt.compare(password, user.password, function(err, result){
                        if(result){
                           DB.adverts.destroy({
                               where:{ id:advert.id },
                               //truncate: true
                           })
                        }else{
                            res.render("deleteAdd", {message:"wrongInput",user})
                        }
                    });
                    res.redirect("/profile");
                }
            }else{
                res.render("deleteAdd", {message:"wrongInput",user,advert})
            }
    }else{
        res.redirect("/");
    }res.end();
}

//Mark as sold

//View an advert
exports.viewAdvert = async function(req, res){
    if(req.session.loggedin){
        //find the correct advert
        advert = await DB.adverts.findOne({where:{id : req.params.id}});
        //find all the details for the breeder
        breeder = await DB.breeders.findOne({where:{ id: advert.breeder_id}});
        breeder1 = await DB.users.findOne({where: {id : breeder.user_id}});
        //find the current users details
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        //increase the view count for the advert
        views = advert.views;
        advert.views = views +1
        advert.save();

        //convert date
        date = new Date(advert.updated_at);
        updatedAt = date.getDate() + "-" + date.getMonth()+1 + "-" + date.getFullYear();

        res.render("viewAdd",{user,breeder,advert,breeder1,updatedAt})
    }else{
        //find the correct advert
        advert = await DB.adverts.findOne({where:{id : req.params.id}});

        //set the user to null
        user =null;
        //find all the details for the breeder
        breeder = await DB.breeders.findOne({where:{ id: advert.breeder_id}});
        breeder1 = await DB.users.findOne({where: {id : breeder.user_id}});

        //increase the view count for the advert
        views = advert.views;
        advert.views = views +1
        advert.save();

        //convert date
        date = new Date(advert.updated_at);
        updatedAt = date.getDate() + "-" + date.getMonth()+1 + "-" + date.getFullYear();

        res.render("viewAdd",{user,breeder,breeder1,advert,updatedAt})
    }
}