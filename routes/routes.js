//imports
const express = require('express');
const router = express.Router();

//required controllers
var index = require('../controllers/indexController');
var login = require('../controllers/loginController');
var newUser = require('../controllers/newUserController');
var standardUser = require('../controllers/userStandardController');
var breederUser = require('../controllers/userBreederController');
var profileControl = require('../controllers/profileController');
var adverts = require('../controllers/advertController');

//home page, logged in users have more functionality
router.get('/', index.homePage);
//filtered resutls
router.post('/filters', index.filterAds);

//about and contact page
router.get('/about',index.about);


//routes related to login
router.post('/login', login.loginAttempt);
router.get('/login', login.loginPage);
router.get('/logout',login.logout);

//main route for sign_up page (account tyoe selection)
router.get('/sign_up', newUser.signup);

//routes for a Breeder to sign up
router.get('/breederSignUp',breederUser.breederSignUp);
router.post('/breeder_sign_up', breederUser.storeBreeder);

//routes for a standard user to sign up
router.get('/userSignUp',standardUser.standardSignUp);
router.post('/sign_up', standardUser.storeUser);

//activate account
router.get('/users/activate/:jwt', newUser.activateAccount);

//routes for users profile, edit, update.
router.get('/profile',profileControl.profile);
router.get('/viewPublicProfile/:id', profileControl.viewPublicProfile);

//for first update of a new profile
router.get('/updateProfile',profileControl.updateProfilePage);
router.post('/profileUpdate',profileControl.updateProfile);

//for editing an already existing profile
router.get('/editProfile', profileControl.editProfilePage);
router.post('/profileEdit',profileControl.editProfile);

//password change
router.get('/passwordChange',profileControl.passwordChangePage);
router.post('/changePassword',profileControl.changePassword);

//delete account
router.get('/deleteProfile', profileControl.deleteProfilePage);
router.post('/profileDelete', profileControl.deleteProfile);

//advert routes
router.get('/viewAdd/:id',adverts.viewAdvert);

//create an advert
router.get('/createAdd',adverts.createAdvert);
router.post('/uploadAdvert', adverts.uploadAdd);

//edit an advert
router.get('/editAdvert/:id',adverts.editAdvertPage);
router.post('/advertEdited/:id',adverts.advertEdited);

//delete an advert
router.get('/deleteAdvert/:id',adverts.deleteAdvert);
router.post('/advertDeleted/:id',adverts.advertDeleted);

//invalid routes automatically redirected
router.get('*',function(req,res){
    res.redirect('/');
});

module.exports = router;
