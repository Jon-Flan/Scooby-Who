//imports
var rateLimit = require("express-rate-limit");


exports.rateLimit = class {
    constructor()
    {
        //blank constructor
    }

    // Set Rate Limiting for initial loading of pages & routes
    initialLimit=
        rateLimit({
        max: 10,// max requests
        windowMs: 60 * 60 * 1000, // per 1 Hour
        handler: function (req, res) {
                res.send("Oops too many requests");
                },
        });
    
    // Set Rate Limiting for initial loading of pages & routes
    loginLimit=
        rateLimit({
        max: 3,// max requests
        windowMs: 15 * 60 * 1000, // per 15min 
        skipSuccessfulRequests: true,
        handler: function (req, res) {
            res.send("Too many login attempts made");
            },
        }); 
}
    


