//reading .env file
require('dotenv').config();

//used to generate a token to be send for email verification
const jwt = require('jsonwebtoken');

//email platform
const nodemailer = require('nodemailer');



class Mailer{

    constructor(){
        //transporter is what will do the delivery of the e-mail
        //setting it to work with our Gmail
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'scooby.who.project@gmail.com',
                pass: 'ScoobySnacks2020', 
            }
        });        

        //options for the email, it will alway be from Scooby-Who
        this.mailOptions = {
            from: '"ScoobyWhoo" <scooby.who.project@gmail.com>', 
        };
    }    

    //sends a welcome email to users after they've sign up
    sendWelcomEmail(uuid, emailTo){
        //generating the token containing only the user's uuid
        const token = jwt.sign(uuid, process.env.ACCESS_TOKEN);

        //setting options for the welcome email
        this.mailOptions.subject = "Activate your account"
        this.mailOptions.to = emailTo;
        this.mailOptions.html = "<b>Thanks for registering with us!</b><br/>Please <a href='http://localhost:8001/users/activate/"+token+"' action='_blank'>click here</a> to activate your account.",

        //sending an email and logging any errors        
        this.transporter.sendMail(this.mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
        });
    }

}

module.exports = Mailer;
