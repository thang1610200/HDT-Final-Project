const express = require("express");
require("dotenv").config();
const router = require(__dirname + "/src/api/v1/routes");
const body_parser = require("body-parser");
require("module-alias/register")
const logEvent = require("@utils/logEvent");
const mongodb = require("@common/MongoDB");

const app = express();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

mongodb.connectDB();

app.use("/static",express.static(__dirname + "/public"));

app.set("views",__dirname + "/src/api/v1/views");
app.set("view engine","ejs");

app.use(router);
app.use((req,res,next) => {
    res.status(404);
    res.json({
        message: "Trang này không tồn tại"
    })
})

app.use((err,req,res,next) => {
    res.status(500);
    logEvent(`${req.url}====${req.method}====${err}`);
    res.json({
        message: "Error"
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server is running in PORT ${PORT}`);
})