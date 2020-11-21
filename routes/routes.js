//imports
const express = require('express');
const router = express.Router();

//required controllers
var loginController = require('../controllers/login');
var userController = require('../controllers/usersMain');
var standardUserController = require('../controllers/usersStandard');
var breederUserController = require('../controllers/usersBreeder');
var mainPageController = require('../controllers/mainPage');

// Main route, all users can visit this page to view adds, certain functionality will not be possible until logged in
router.get('/',function(req,res){
    res.render('index');
    res.end();
});

//home page once logged in
router.get('/home/:uuid', mainPageController.homePage);

//routes related to login
router.post('/login', loginController.loginAttempt);
router.get('/login', loginController.loginPage);
router.get('/logout', loginController.logout);

//routes related to sign_up
router.get('/sign_up', userController.signup);

//routes for a Breeder to sign up
router.get('/breederSignUp',breederUserController.breederSignUp);
router.post('/breeder_sign_up', breederUserController.storeBreeder);

//routes for a standard user to sign up
router.get('/userSignUp',standardUserController.standardSignUp);
router.post('/sign_up', standardUserController.storeUser);

//routes related to user profile
router.put('/users/:uuid', userController.update);

//invalid routes automatically redirected
router.get('*',function(req,res){
    res.redirect('/');
});

module.exports = router;
