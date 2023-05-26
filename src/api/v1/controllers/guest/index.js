const express = require("express");
const fs = require('fs');
const jwt = require("jsonwebtoken");
const passport = require('passport');
const createError = require('http-errors');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("module-alias/register");
const { validationResult } = require('express-validator');
const RegisterValidation = require("@validation/register.validation");
const LoginValidation = require("@validation/login.validation");
const ForgotPassValidator = require("@validation/forgot_pass.validation");
const ResetPassValidator = require("@validation/reset_pass.validation");
const UserService = require("@service/user.service");
const ResetPassService = require("@service/resetpass.service");
const passportConfig = require("@config/passport.config");
const {client} = require("@common/Redis");
require("dotenv").config();

const router = express.Router();
//==============Cấu hình Passport
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
      done(null, user);
});

//=========

//==========================Login FB
passport.use(new FacebookStrategy({
    clientID: passportConfig.FB_ID,
    clientSecret: passportConfig.FB_SECRET,
    callbackURL: `${process.env.URL}/api/v1/guest/facebook/callback`,
    profileFields: ['id', 'displayName','emails']
  },
  async function(accessToken, refreshToken, profile, cb) {        // B2: trả dữ liệu về
        try{
            const user = await UserService.getOnebyEmail(profile.emails[0].value);

            if(!user){
                user = await UserService.createUserNoPass(profile.displayName, profile.emails[0].value);
            }
            return cb(null,user);
        }
        catch(err){
            return cb(err);
        }
  }                                                          
 ))
 
 router.get('/facebook',  //B1: vô đường dẫn
   passport.authenticate('facebook')); 
 
 router.get('/facebook/callback',                         // B5: trả về kết quả
   passport.authenticate('facebook', { failureRedirect: '/api/v1/guest/login' }),
   async function(req, res) {
        const token = await UserService.generateTokenByEmail(req.user.email);
      res.cookie("token",token,{
        httpOnly: false,  // khi sử dụng https để true
        secure: false, // khi deploy để true
        path: "/api/v1",
       // sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
       res.redirect('/api/v1/shop');
   });
//==========================Login FB ====================================//

//==========================Login GG
passport.use(new GoogleStrategy({
    clientID: passportConfig.GOOGLE_ID,
    clientSecret: passportConfig.GOOGLE_SECRET,
    callbackURL: `${process.env.URL}/api/v1/guest/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    try{
        const user = await UserService.getOnebyEmail(profile.emails[0].value);

        if(!user){
            user = await UserService.createUserNoPass(profile.displayName, profile.emails[0].value);
        }
        return cb(null,user);
    }
    catch(err){
        return cb(err);
    }
  }
 ));
 
 router.get('/google',
   passport.authenticate('google',{ scope: ['profile','email'] }));
 
 router.get('/google/callback', 
   passport.authenticate('google', { failureRedirect: '/api/v1/guest/login' }),
   async function(req, res) {
     // Successful authentication, redirect home.
     const token = await UserService.generateTokenByEmail(req.user.email);
     res.cookie("token",token,{
      httpOnly: false,  // khi sử dụng https để true
      secure: false, // khi deploy để true
      path: "/api/v1",
      //sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
    res.redirect('/api/v1/shop');
   });

//==========================Login GG ====================================//

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
                //sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
           res.json({accessToken: req.token});
        }
});
//===========================Login============================//

//===========================Logout==========================//
router.get('/logout',(req,res,next) => {
    const publickey = fs.readFileSync("./src/api/v1/keys/publickey.crt");
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/api/v1/guest/login");
    }
    jwt.verify(token,publickey,{ algorithms: ['RS256'] },(err,data) => {
        if(err){
            return res.redirect("/api/v1");
        }
        client.del(data.id, (err,reply) => {
            if(err){
                return next(new createError.InternalServerError());
            }
            if(reply === 1){
                res.clearCookie("token",{ path: '/api/v1' });
                return res.redirect("/api/v1/guest/login");
            }
        })
    });
})
//======================================logout

//==============================Forgot Pass
router.get("/forgot_password", (req,res) => {
    res.render("forgot_password");
})
    .post('/forgot_password',ForgotPassValidator, (req,res,next) => {
        const errors = validationResult(req,next);
        if(!errors.isEmpty()){
            res.json({errors});
        }
        else{
            res.json({email: req.reset.email});
        }
})

router.get("/forgot_password/reset", async (req,res,next) => {
    const {token, email} = req.query;
    const resetPass = await ResetPassService.findEmail(email);
    if(resetPass == token){
        res.render("reset_password",{email: email});
    }
    else{
        return next(new createError.Forbidden());
    }
})
    .post('/forgot_password/reset',ResetPassValidator ,async (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({errors});
        }
        else{
            const {email,password} = req.body;
            await UserService.updatePass(email, password);
            try {
               const rePass = await ResetPassService.delEmail(email);
               if(rePass == 0){
                    return res.json({statusCode: 403});
               }
               else{
                    return res.json({statusCode: 200});
               }
            }
            catch(err){
                return next(new createError.InternalServerError());
            }
        }
})
//========================================Forgot Pass

module.exports = router;