//models
var DB = require('../models');

const bcrypt = require("bcryptjs");

//get the users profile page
exports.profile = async function(req, res) {
    if(req.session.loggedin){
        //Database searches using the passed in uuid to find all relevant info for the profile
        //Find the main user details
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        //check if the user has filled in their futher details
        if(user.user_type === "C"){
            userDetails = await DB.customers.findOne({where:{user_id : user.id}});
            if(userDetails === null){
                res.redirect('updateProfile')
            }
        }else if(user.user_type === "B"){
            userDetails = await DB.breeders.findOne({where:{user_id : user.id}});
            //find any related adverts
            adverts= await DB.adverts.findAll({where: {breeder_id : userDetails.id}});

            if(userDetails === null){
                res.redirect('updateProfile')
            }
        }
        //find any related invoices
        invoice = await DB.invoices.findAll({where: {customer_id : req.session.uuid}});

        //convert the validated date for display on the page
        date = new Date(user.validated_at)
        joinDate = date.getDate() + "-" + date.getMonth()+1 + "-" + date.getFullYear();

        date2 = new Date(userDetails.updated_at);
        updatedAt = date2.getDate() + "-" + date2.getMonth()+1 + "-" + date2.getFullYear();

        //render the profile page and pass in all relevant details
        res.render("profile",{user, userDetails,joinDate, updatedAt,invoice, adverts});
    }else{
        res.redirect("/");
    }
    res.end();
}

//get the first time update page
exports.updateProfilePage = async function(req, res){
    if(req.session.loggedin){
        //find the user from the uuid
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        //find the rest of the relevant information if its a customer or a Breeder
        if(user.user_type === "C"){
            userDetails = await DB.customers.findOne({where:{user_id : user.id}});
        }else if(user.user_type === "B"){
            userDetails = await DB.breeders.findOne({where:{user_id : user.id}})
        }
        //render the update page with the current user info
        res.render("updateProfile", {user, userDetails});
    }else{
        res.redirect("/");
    }
    res.end();
}

//post for first time update
exports.updateProfile = async function(req,res){

    //first check they are logged in.
    if(req.session.loggedin){

        //function to test for empty string or all spaces
        function isEmptyOrSpaces(str){
            return str === null || str.match(/^ *$/) !== null;
        }
        

        //regex tests for mallicous entries(one for username reg1 & other for other inputs)
        var reg = new RegExp ("^[A-Za-z0-9,\-,'+. ]+$");
        var reg2 = new RegExp ("^[A-Za-z0-9,-]+$");

        //find the user from the uuid
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        //then check if they're a breeder or a customer
        if(user.user_type === "C"){
            userDetails = await DB.customers.findOne({where:{user_id : user.id}})

            //make sure there isn't already a user present
            if(userDetails === null){
                
                update_date = new Date();

                //get the details from the form
                var name = req.body.name;
                var surname = req.body.surname;
                var phone = req.body.phone;
                var userID = user.id;

                //upddate the database
                //build the user update
                userUpdate = DB.customers.build(req.body);
                
                //test the name input
                if(!isEmptyOrSpaces(name)){
                    var nameOK = reg.test(name);

                    if(nameOK){
                        userUpdate.name = name;
                    }
                }
                //test the surname input
                if(!isEmptyOrSpaces(surname)){
                    var surnameOK = reg.test(surname);

                    if(surnameOK){
                        userUpdate.surname = surname;
                    }
                }
                //test the phone input
                if(!isEmptyOrSpaces(phone)){
                    var phoneOK = reg.test(phone);
                        
                    if(phoneOK){
                        userUpdate.mobile_phone = phone;
                    }
                }
                //save new user details    
                userUpdate.user_id = userID;
                userUpdate.updated_at = update_date;
                userUpdate.save();

                //redirect to home page
                res.redirect("/");

            }else{
                redirect("/");
            }
        }else if(user.user_type === "B"){
            userDetails = await DB.breeders.findOne({where:{user_id : user.id}})

            //make sure there isnt already a user present
            if(userDetails === null){

                update_date = new Date();

                //get the details from the form
                var name = req.body.name;
                var surname = req.body.surname;
                var phone = req.body.phone;
                var address1 = req.body.address1;
                var address2 = req.body.address2;
                var city = req.body.city;
                var county = req.body.county;
                var postcode = req.body.postcode;
                var regNumber = req.body.regNumber;
                var userID = user.id;
                var kennelName = req.body.kennel;

                //create breeder update to be inserted in DB
                breederUpdate = DB.breeders.build(req.body);

                 //test the name input
                 if(!isEmptyOrSpaces(name)){
                    var nameOK = reg.test(name);

                    if(nameOK){
                        breederUpdate.name = name;
                    }
                }
                //test the surname input
                if(!isEmptyOrSpaces(surname)){
                    var surnameOK = reg.test(surname);

                    if(surnameOK){
                        breederUpdate.surname = surname;
                    }
                }
                //test the phone input
                if(!isEmptyOrSpaces(phone)){
                    var phoneOK = reg.test(phone);

                    if(phoneOK){
                        breederUpdate.mobile_phone = phone;
                    }
                }
                //test the address1 input
                if(address1 !== ''){
                    var address1OK = reg.test(address1);

                    if(address1OK){
                        breederUpdate.address_1 = address1
                    }
                }
                //test address2 input
                if(address2 !== ''){
                    var address2OK = reg.test(address2);

                    if(address2OK){
                        breederUpdate.address_2 = address2;
                    }
                }
                //test the city input
                if(!isEmptyOrSpaces(city)){
                    var cityOK = reg.test(city);

                    if(cityOK){
                        breederUpdate.city = city;
                    }
                }
                //test the county input
                if(!isEmptyOrSpaces(county)){
                    var countyOK = reg.test(county);

                    if(countyOK){
                        breederUpdate.county = county;
                    }
                }
                //test the postcode input
                if(!isEmptyOrSpaces(postcode)){
                    var postcodeOK = reg.test(postcode);

                    if(postcodeOK){
                        breederUpdate.post_code = postcode;
                    }
                }
                //test the reg number input
                if(regNumber !== ''){
                    var regNumOK = reg2.test(regNumber);

                    if(regNumOK){
                        breederUpdate.registration_number = regNumber;
                    }
                }
                //test the kennel name
                if(!isEmptyOrSpaces(kennelName)){
                    var kennelOK = reg.test(kennelName);

                    if(kennelOK){
                        breederUpdate.kennel_name = kennelName;
                    }
                }
                //save the breeders details
                breederUpdate.user_id = userID;
                breederUpdate.updated_at = update_date;
                breederUpdate.documentation = "Uploaded";
                breederUpdate.save();

                //redirect to their profile page
                res.redirect("/");
            }else{
                res.redirect("/");
            }    
        }
    }else{
        res.redirect('/');
    }
    res.end();
}

//for getting the edit a current profile page
exports.editProfilePage = async function (req,res){
    if(req.session.loggedin){
        //find the user in the users db
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        //find the rest of the relevant information if its a customer or a Breeder
        if(user.user_type === "C"){
            userDetails = await DB.customers.findOne({where:{user_id : user.id}});
        }else if(user.user_type === "B"){
            userDetails = await DB.breeders.findOne({where:{user_id : user.id}})
        }
        //render the edit page with the current user info
        res.render("editProfile", {user, userDetails});
    }else{
        res.redirect('/');
    }res.end()
}

//POST for updating any edits to a profile
exports.editProfile = async function (req,res){
    //logged in then continue, if not redirect to home page
    if(req.session.loggedin){
        //function to test for empty string or all spaces
        function isEmptyOrSpaces(str){
            return str === null || str.match(/^ *$/) !== null;
        }

        //regex tests for mallicous entries(one for username reg1 & other for other inputs)
        var reg = new RegExp ("^[A-Za-z0-9,\-,'+. ]+$");
        var reg1 = new RegExp("^[A-Za-z0-9]+$");

         //find the user from the uuid
         user = await DB.users.findOne({where: {uuid: req.session.uuid}});

         //find which type of user is submitting the form
        if(user.user_type === "C"){
            //find the userDetails in the table
            userDetails = await DB.customers.findOne({where:{user_id : user.id}})    
        }else if(user.user_type === "B"){
            //find the userDetails in the table
            userDetails = await DB.breeders.findOne({where:{user_id : user.id}})
        }
        //make sure there are already details in the user table
        if( userDetails === null){
            //if not redirect to the initial update profile page
            res.redirect('updateProfile')
        }else{
            //get the inputs from the form
            update_date = new Date();

            //get the details from the form
            var username = req.body.username
            var name = req.body.name;
            var surname = req.body.surname;
            var phone = req.body.phone;
            update_date = new Date();

            //test username and update if needed
            if(!isEmptyOrSpaces(username)){

                var usernameOK = reg1.test(username);

                if(usernameOK){
                    user.username = username;
                    user.updated_at = update_date;
                } 
            }
            //test name and update if needed
            if(!isEmptyOrSpaces(name)){

                var nameOK = reg.test(name);

                if(nameOK){
                    userDetails.name = name;
                }
            }
            //test surname and update if needed
            if(!isEmptyOrSpaces(surname)){

                var surnameOK = reg.test(surname);

                if(surnameOK){
                    userDetails.surname = surname;
                }  
            }
            //test phone and update if needed
            if(!isEmptyOrSpaces(phone)){

                var phoneOK = reg.test(phone)

                if(phoneOK){
                    userDetails.mobile_phone = phone;
                }
            }
            //save the new username
            user.save();

            //save the new profile details
            userDetails.updated_at = update_date;
            userDetails.save();

            res.redirect('profile');
        }
    }else{
        res.redirect("/");
    }res.end();
}

//get the password management page
exports.passwordChangePage = async function(req, res){
    if(req.session.loggedin){
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        res.render("passwordChange", {message:"none", user});        
    }else{
        res.redirect("/");
    }res.end();
}

exports.changePassword = async function(req, res){
    if(req.session.loggedin){
        //get the inputs from the form
        var passwordOld = req.body.passwordOld;
        var passwordNew = req.body.passwordNew;
    
    //test user input again if somehow a mallicous entry also validate email address
    var reg = new RegExp ("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$");
    var passwordOldOK= reg.test(passwordNew);
    var passwordNewOK = reg.test(passwordOld);

        //if inputs are ok continue
        if(passwordOldOK && passwordNewOK){
            //find the user in the users db
            user = await DB.users.findOne({where: {uuid: req.session.uuid}});

            bcrypt.compare(passwordOld, user.password,function(err, result){
                if(result){
                    bcrypt.genSalt(10, function(err, salt){
                        bcrypt.hash(passwordNew, salt, function(error, hash){
                            user.password = hash;
                            user.save();
                        });
                    });
                }else{
                    res.render("passwordChange", {message:"wrongInput",user})
                }
            });
            res.redirect("/");
        }else{
            res.render("passwordChange", {message:"wrongInput",user})
        }
    }else{
        res.redirect("/");
    }res.end();
}

exports.deleteProfilePage = async function(req,res){
    if(req.session.loggedin){
        //find the user in the users db
        user = await DB.users.findOne({where: {uuid: req.session.uuid}});

        res.render("deleteProfile",{message:"none", user});
    }else{
        res.redirect("/");
    }res.end()
}

exports.deleteProfile = async function(req,res){
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

                bcrypt.compare(password, user.password, function(err, result){
                    if(result){
                       DB.users.destroy({
                           where:{ uuid:user.uuid },
                           truncate: true
                       })
                    }else{
                        res.render("deleteProfile", {message:"wrongInput",user})
                    }
                });
                res.redirect("/logout");
            }else{
                res.render("deleteProfile", {message:"wrongInput",user})
            }
    }else{
        res.redirect("/");
    }res.end();
}

exports.viewPublicProfile = async function(req,res){
    if(req.session.loggedin){

        user = await DB.users.findOne({where: {uuid: req.session.uuid}});
        breederDetails = await DB.breeders.findOne({where:{ user_id: req.params.id}});
        breeder = await DB.users.findOne({where: {id : breederDetails.user_id}});
        adverts= await DB.adverts.findAll({where: {breeder_id : breederDetails.id}});

        //convert the validated date for display on the page
        date = new Date(breeder.validated_at)
        joinDate = date.getDate() + "-" + date.getMonth()+1 + "-" + date.getFullYear();

        res.render("viewProfile",{user,breeder,adverts,breederDetails,joinDate})
    }else{
        res.redirect('/login');
    }res.end();
}