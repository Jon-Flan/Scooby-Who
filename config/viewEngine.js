//imports
const express = require("express");


function viewEngine(app){
    
    // Set static locations
    app.use("/public",express.static(__dirname + "/views"));
    app.use("/public",express.static(__dirname + "/partials"));
    app.use("/public",express.static(__dirname + "/scripts"));
    app.use("/public",express.static(__dirname + "/images"));

    //set the view engine
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
}

module.exports = viewEngine