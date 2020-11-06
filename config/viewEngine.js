//imports
const express = require("express");
const path = require('path');


function viewEngine(app){
    
    // Set static locations
    app.use(express.static('public'));

    app.use('/style',express.static(__dirname + "/style"));
    app.use('/images',express.static(__dirname + "/images"));
    app.use('/scripts',express.static(__dirname + "/scripts"));
    app.use('/favicon',express.static(__dirname + "/favicon"));


    //set the view engine
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);
}

module.exports = viewEngine