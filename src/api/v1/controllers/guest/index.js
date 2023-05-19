const express = require("express");
require("module-alias/register");
const { validationResult } = require('express-validator');
const RegisterValidation = require("@validation/register.validation");
const LoginValidation = require("@validation/login.validation");
const UserService = require("@service/user.service");
require("dotenv").config();

const router = express.Router();

//==========================Register
router.get("/register", (req,res) => {
    res.render("register");
})
    .post("/register", RegisterValidation ,async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
           res.render("register",errors);
        }
        else{
           const {fullname, email, password} = req.body;
           await UserService.createUser(fullname,email,password);
           req.flash('register','Successful account registration');
           res.redirect(req.baseUrl + '/login');
        }        
});
//============================Register====================//

//============================Login
router.get("/login", (req,res) => {
    res.render("login",{message: req.flash('register')});
})
    .post("/login", LoginValidation ,async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
           res.json({errors});
        } 
        else{      
            res.cookie("token",req.token,{
                httpOnly: false,  // khi sử dụng https để true
                secure: false, // khi deploy để true
                path: "/api/v1",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
           res.json({accessToken: req.token});
        }
});

//===========================Login============================//

module.exports = router;