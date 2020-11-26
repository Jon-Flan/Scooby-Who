//imports
const express = require('express');
const router = express.Router();

//has the middleware to verify if the user is authenticated
const authentication = require('../config/auth');

//required controllers
var mainPageController = require('../controllers/mainPage');
var loginController = require('../controllers/login');
var userController = require('../controllers/usersMain');
var standardUserController = require('../controllers/usersStandard');
var breederUserController = require('../controllers/usersBreeder');

//home page, logged in users have more functionality
router.get('/', mainPageController.homePage);

//routes related to login
router.post('/login', loginController.loginAttempt);
router.get('/login', loginController.loginPage);
router.get('/logout', loginController.logout);

//main route for sign_up page (account tyoe selection)
router.get('/sign_up', userController.signup);

//routes for a Breeder to sign up
router.get('/breederSignUp',breederUserController.breederSignUp);
router.post('/breeder_sign_up', breederUserController.storeBreeder);
router.get('/breeders/profile', authentication.isLoggedIn, breederUserController.profile);
router.put('/breeders/profile', authentication.isLoggedIn, breederUserController.updateProdile);

//routes for a standard user to sign up
router.get('/userSignUp',standardUserController.standardSignUp);
router.post('/sign_up', standardUserController.storeUser);

//routes related to user profile
router.put('/users/change_password/:uuid', authentication.isLoggedIn, userController.updatePassword);
router.get('/users/change_password', authentication.isLoggedIn, userController.changePassword);
router.get('/users/activate/:jwt', userController.activateAccount);

//invalid routes automatically redirected
router.get('*',function(req,res){
    res.redirect('/');
});

module.exports = router;
