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
    });
}

module.exports = server