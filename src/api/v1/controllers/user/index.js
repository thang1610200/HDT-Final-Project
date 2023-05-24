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
const productService = require("@service/product.service");
const couponService = require("@service/coupon.service");
const orderService = require("@service/order.service");
const drive = require("@util/drive");
const {sendMail} = require("@util/mail.js");
const NewpassValidator = require("@validation/newpass.validation");
const SetPassValidator = require("@validation/setpass.validation");
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
        return res.render("set_password",{data: user, sum_cart:cart});
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
    .post('/setpass',SetPassValidator,async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({errors});
        }
        else{
            await userService.updatePassbyID(req.user.id, req.body.password);
            res.json({statusCode: 200});
        }
})

//===========================Cart
router.get('/cart',async (req,res) => {
    const cart = await cartService.getAllProductByUserId(req.user.id);
    res.render('cart', {cart: cart});
})
    .post("/cart", async (req,res) => {
        const {id, value} = req.body;
        const product = await productService.findOnebyId(id);
        if((Number(value) < Number(product.Quantity)) && (Number(value) >= 0)){
            const cart = await cartService.getCartbyUserID(req.user.id);
            await cartService.updateQuantityProduct(cart.id, id, Number(value) + 1);
        }
        const product_cart = await cartService.getAllProductByUserId(req.user.id);
        var sum = 0;
        product_cart.forEach(function(product){
            sum = sum + Number(product.cartdetail.Price) * Number(product.cartdetail.Quantity)
        });
        res.json({data:product_cart, sum: sum});
})
    .post("/remove_product", async (req,res, next) => {
        const {id} = req.body;
        const cart = await cartService.getCartbyUserID(req.user.id);
        const result = await cartService.removeProduct(cart.id,id);
        if(result.ok === 1){
            const product_cart = await cartService.getAllProductByUserId(req.user.id);
            var sum = 0;
            product_cart.forEach(function(product){
                sum = sum + Number(product.cartdetail.Price) * Number(product.cartdetail.Quantity)
            });
            return res.json({data:product_cart, sum: sum});
        }
        return next(new createError.InternalServerError());
})
    .post('/discount', async (req,res) => {
        const {code} = req.body;
        const coupon = await couponService.getCouponByCode(code);
        const product_cart = await cartService.getAllProductByUserId(req.user.id);
        var sum = 0;
        product_cart.forEach(function(product){
            sum = sum + Number(product.cartdetail.Price) * Number(product.cartdetail.Quantity)
        });
        if(!coupon){
            res.json({statusCode: 400, sum: sum}); // Nếu mã code không tồn tại
        }
        else{
            const couponItem = await couponService.getItemByUserIDAndCode(req.user.id, coupon.id);
            if(coupon.Quantity <= 0 || couponItem || coupon.Status || (new Date(coupon.Start_date) > new Date()) || (new Date(coupon.End_date) < new Date() )){
                res.json({statusCode: 201, sum: sum});  // nếu số lượng disount không còn or user đã sài discount này r thì sẽ thông báo hoặc coupon ko còn time
            }
            else{
                sum = (sum * (100 - coupon.Value)) / 100;
                res.json({statusCode: 200, sum: sum});
            } 
        }
})
    .post("/cart/checkout", async (req,res) => {
        const {code} = req.body;
        const coupon = await couponService.getCouponByCode(code);
        const product_cart = await cartService.getAllProductByUserId(req.user.id);
        var sum = 0;
        product_cart.forEach(function(product){
            sum = sum + Number(product.cartdetail.Price) * Number(product.cartdetail.Quantity)
        });
        if(coupon){
            sum = (sum * (100 - coupon.Value)) / 100;
        }
        await orderService.createOrder(req.user.id, coupon, sum);
        // const order = await orderService.getOrderByUserId(req.user.id);
        // product_cart.forEach(async function(product){
        //     await orderService.addItemOrder(order.id, product.productdetail.id, product.productdetail.Product_name, product.cartdetail.Quantity, product.cartdetail.Price);
        // });
        return res.json({statusCode: 200});
})

router.get("/checkout", async (req,res) => {
    const product_cart = await cartService.getAllProductByUserId(req.user.id);
    const order = await orderService.getOrderByUserId(req.user.id);
    res.render("checkout",{product_cart: product_cart, sum: order.Total});
})

module.exports = router;