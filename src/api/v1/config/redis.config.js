require("dotenv").config();

module.exports = {
    port: process.env.PORT_REDIS,
    host: process.env.HOST_REDIS
}