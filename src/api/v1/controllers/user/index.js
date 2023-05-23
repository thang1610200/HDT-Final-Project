const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require('fs');
const createError = require('http-errors');
require("dotenv").config();
const multer = require('multer');
require("module-alias/register");
const Author = require("@middleware/Author.middleware");
const userService = require("@service/user.service");
const cartService = require("@service/cart.service");
const drive = require("@util/drive");
const {sendMail} = require("@util/mail.js");
const NewpassValidator = require("@validation/newpass.validation");
const {client} = require("@common/Redis");
const { validationResult } = require('express-validator');


router.use(Author.verifyToken);
router.use(Author.checkURLuser);

const upload = multer();
router.get("/profile", async (req,res) => {
    const user = await userService.getUserbyId(req.user.id);
    const cart = await cartService.getItembyUserId(req.user.id);
    res.render("profile",{data: user, sum_cart:cart});
})
    .post("/profile",upload.single("photo"), async (req,res) => {
        const {fullname, address, phone} = req.body;
        var drives;
        if(req.file){
            drives = await drive.uploadFile(req.file);
        }
        var user;
        if(!phone){
            user = await userService.updateInforNoPhone(req.user.id, fullname, address, drives);
        }
        else{
            user = await userService.updateInfor(req.user.id, fullname, address, phone, drives);
        }
        res.json({data:user});
})

// gửi email xác nhận tới User
router.get('/email',async (req,res) => {
    const user = await userService.getUserbyId(req.user.id);
    if(!user.isEmailActive){
        const url = `${process.env.URL}/api/v1/email/verify/${user.email_code}`;
         sendMail(user.email,url);
         res.render("checkmail",{data: user});
    }
    else{
        res.redirect("/api/v1/user/profile");
    }
})

//đặt lại Password mới
router.get('/newpass',async (req,res) =>{
    const user = await userService.getUserbyId(req.user.id);
    const cart = await cartService.getItembyUserId(req.user.id);
    if(!user.password){
        return res.redirect("/api/v1/user/setpass");
    }
    res.render('change_password',{data: user, sum_cart:cart});
})
    .post('/newpass',NewpassValidator, async(req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({errors});
        } 
        else{
            await userService.updatePassbyID(req.user.id, req.body.newpass);
            const publickey = fs.readFileSync("./src/api/v1/keys/publickey.crt");
            const token = req.cookies.token;
            jwt.verify(token,publickey,{ algorithms: ['RS256'] },(err,data) => {
                if(err){
                    return next(new createError.InternalServerError());
                }
                client.del(data.id, (err,reply) => {
                    if(err){
                        return next(new createError.InternalServerError());
                    }
                    if(reply === 1){
                        res.clearCookie("token",{ path: '/api/v1' });
                        return res.json({statusCode:200});
                    }
                })
            });
        }
})


module.exports = router;