//imports
var rateLimit = require("express-rate-limit");

    // Set Rate Limiting for initial loading of pages & routes
     const refreshLimit=
        rateLimit({
        max: 30,// max requests
        windowMs: 60 * 60 * 1000, // per 1 Hour
        handler: function (req, res) {
                res.send("Oops too many requests");
                },
        });
    
    // Set Rate Limiting for initial loading of pages & routes
   const loginLimit=
        rateLimit({
        max: 3,// max requests
        windowMs: 15 * 60 * 1000, // per 15min 
        skipSuccessfulRequests: true,
        handler: function (req, res) {
            res.send("Too many login attempts made");
            },
        }); 


module.exports = {refreshLimit , loginLimit};

