const mongoose = require("mongoose");
const config = require("@config/database.config");
const logEvent = require("@utils/logEvent");

const url = config.DATABASE_URL;
const connectDB = () => {
    mongoose.connection.on("error", function(err){
        logEvent(`${"database"}====${"MongoDB"}====${err}`);
    })
    .on("disconnected", connectDB)
    .once("open", function(){
        console.log("MongoDB is connect");
    })
    mongoose.set('strictQuery', false);
    return mongoose.connect(url);
}

module.exports = {
    connectDB: connectDB
}