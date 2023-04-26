const mongoose = require("mongoose");
const config = require("@config/database.config");
const logEvent = require("@utils/logEvent");

const url = config.DATABASE_URL;
const connectDB = async () => {
    try{
        mongoose.set('strictQuery', false);
        mongoose.connect(url);
        console.log("MongoDB is connect");
    }
    catch(err){
        logEvent(`${database}====${mongodb}====${err}`);
    }
}

module.exports = {
    connectDB: connectDB
}