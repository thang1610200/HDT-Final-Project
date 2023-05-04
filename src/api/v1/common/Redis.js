const redis = require("redis");
const config = require("@config/redis.config");

const client = redis.createClient({
    legacyMode: true,
    port: config.port,
    host: config.host
})

const connectRedis = async () => {
    client.on("error", function(err){
        logEvent(`${"database"}====${"Redis"}====${err}`);
    })
    .on("connect", function(){
        console.log("Redis is connect");
    });
    return await client.connect();
}

module.exports = {
    connectRedis,
    client
}

