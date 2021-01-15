module.exports = {
    apps: [{
        name:"ScoobyWho",
        script:"./server-env.js",
        watch: true,
        exec_mode:"fork",
        env:{
            NODE_ENV:"production"
        }
    }]
}