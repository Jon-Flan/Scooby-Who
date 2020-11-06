//imports
const http = require("http");

//initialize .env file
require('dotenv').config();//set to default .env but can also be {path: "path/filename"}

function server(app){
    //Port settings for http
    let port = process.env.PORT;
    let host = process.env.HOST;

    //create server
    let server = http.createServer(app);

    server.listen(port, host,()=>{
        console.log(`Server Running on ${host}:${port}`);
        if(process.env.NODE_ENV=="production"){
            console.log("Production Mode, make sure you are not using this mode for development")
        }else{
            console.log("Dev mode: safe to develop")
        }
    });
}

module.exports = server