const jwt = require("jsonwebtoken");
require("dotenv").config();
require("module-alias/register");
const fs = require('fs');
const {client} = require("@common/Redis");
const createError = require('http-errors');

function verifyToken(req,res,next){
    const publickey = fs.readFileSync("./src/api/v1/keys/publickey.crt");
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/api/v1/guest/login");
    }
    jwt.verify(token,publickey,{ algorithms: ['RS256'] },(err,data) => {
        if(err){
            return res.redirect("/api/v1/guest/login");
        }
        client.get(data.id, (err,reply) => {
            if(err){
                return next(new createError.InternalServerError());
            }
            if(reply === null){
                return res.redirect("/api/v1/guest/login");
            }
            req.user = data;
            return next();
        })
    });
}

function checkURLuser(req,res,next){
    const role = req.user.role;
    if(role === "Admin" || role === "User"){
        return next();
    }
    return next(new createError.Forbidden());
}

function checkURLadmin(req,res,next){
    const role = req.user.role;
    if(role === "Admin"){
        return next();
    }
    return next(new createError.Forbidden());
}

function publicURL(req,res,next){
    const publickey = fs.readFileSync("./src/api/v1/keys/publickey.crt");
    const token = req.cookies.token;
    if(!token){
        req.user = null;
        return next();
    }
    jwt.verify(token,publickey,{ algorithms: ['RS256'] },(err,data) => {
        if(err){
            return res.redirect("/api/v1/guest/login");
        }
        client.get(data.id, (err,reply) => {
            if(err){
                return next(new createError.InternalServerError());
            }
            if(reply === null){
                req.user = null;
                return next();
            }
            req.user = data;
            return next();
        })
    });
}

module.exports = {
    verifyToken: verifyToken,
    checkURLuser: checkURLuser,
    checkURLadmin: checkURLadmin,
    publicURL :publicURL
};