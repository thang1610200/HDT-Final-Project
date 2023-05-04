const express = require("express");
require("dotenv").config();
const router = require(__dirname + "/src/api/v1/routes");
const body_parser = require("body-parser");
require("module-alias/register")
const flash = require('connect-flash');
const session = require("express-session");
const createError = require('http-errors');
const cookie_parser = require("cookie-parser");
const logEvent = require("@utils/logEvent");
const mongodb = require("@common/MongoDB");
const {connectRedis} = require("@common/Redis");

const app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

mongodb.connectDB();
connectRedis();

app.use(cookie_parser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}));
app.use(flash());

app.use("/static",express.static(__dirname + "/public"));

app.set("views",__dirname + "/src/api/v1/views");
app.set("view engine","ejs");

app.use('/api/v1',router);

app.use((req,res,next) => {
    next(new createError.NotFound("This route does not exist"));
})

// bắt lỗi và in ra 
app.use((err,req,res,next) => {
    logEvent(`${req.url}====${req.method}====${err}`);
    res.json({
        status: err.status || 500,
        message: err.message
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server is running in PORT ${PORT}`);
})