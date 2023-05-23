const express = require("express");
const createError = require('http-errors');
require("module-alias/register");
const productService = require("@service/product.service");
const listimageService = require("@service/listimage.service");
const cartService = require("@service/cart.service");
const categoryService = require("@service/category.service");
const userService = require("@service/user.service");
const Author = require("@middleware/Author.middleware");
const router = express.Router();

router.use("/guest",require("@controllers/guest"));
router.use("/user",require("@controllers/user"));
router.use("/admin",require("@controllers/admin"));
//router.use("/test",require("@controllers/test"));

router.get("/",(req,res) => {
    res.render("homepage");
});

//=============================Shop
router.get("/shop", Author.publicURL ,async (req,res) => {
    const countProduct = await productService.findAll();
    const product = await productService.paging(1);
    const image = await listimageService.getMainImage();
    var cart;
    if(req.user !== null){
        cart = await cartService.getItembyUserId(req.user.id);
    }
    const cate = await categoryService.catejoinProductbyDel();
    res.render("shop",{data: product, count: countProduct.length, sum_cart:cart, imagem: image, cate: cate});
})
    .post("/shop",Author.publicURL, async (req,res) => {
        const {id} = req.body;
        if(req.user !== null){
            const product = await productService.findOnebyId(id);
            const cartP = await cartService.getCartItemByProductId(product.id);
            let count = !cartP ? 0 : cartP.Quantity;
            if((Number(product.Quantity) - Number(count)) === 0){
                return res.json({statusCode: 500});
            }
            else{
                const cart = await cartService.addCart(req.user.id, product.id, product.Price);
                const cartitem = await cartService.getItembyCartId(cart.Cart_id);
                return res.json({cart: cartitem, statusCode: 200});
            }
        }
        return res.json({statusCode: 403});
})
    .post("/shop/paging", async (req,res) => {
        const {page, cateFilter, sortProduct} = req.body;
        const image = await listimageService.getMainImage();
        const product = await productService.pagingAndfilterCate(page,cateFilter, sortProduct);
        const countProduct = await productService.countProductFilterCate(cateFilter);
        res.json({data: product, count: countProduct.length, imagem: image});
})
    .post("/shop/search", async (req,res) => {
        const {data} = req.body;
        const product = await productService.findProductName(new RegExp("^" + data,"i"));
        const image = await listimageService.getMainImage();
        res.json({data: product, imagem: image});
})
//===============================================Shop

//=====================================Product Detail
router.get("/product_detail/:id", Author.publicURL, async (req,res,next) => {
    const id = req.params.id;
    const product = await productService.findAllandCategorybyId(id);
    const listimage = await listimageService.getImageByProductId(id);
    const productCate = await categoryService.getAllProductAndImagebyCate(product[0].Category_id);
    if(product.length != 0){
        var cart;
        if(req.user !== null){
            cart = await cartService.getItembyUserId(req.user.id);
        }
        return res.render("product_detail",{product: product, listimage: listimage, productCate: productCate, sum_cart:cart});
    }
    return next(new createError.Forbidden())
})
    .post("/product_detail",Author.publicURL, async (req,res) => {
        const {id, quantity} = req.body;
        if(req.user !== null){
            const product = await productService.findOnebyId(id);
            const cartP = await cartService.getCartItemByProductId(product.id);
            let count = !cartP ? 0 : cartP.Quantity;
            if((Number(product.Quantity) - Number(count)) < Number(quantity)){
                return res.json({statusCode: 500});
            }
            else{
                const cart = await cartService.addCartDetailProduct(req.user.id, product.id, product.Price, quantity);
                const cartitem = await cartService.getItembyCartId(cart.Cart_id);
                return res.json({cart: cartitem, statusCode: 200});
            }
        }
        return res.json({statusCode: 403});
})
    .post("/product_detail/quantity_dec", async (req,res) => {
        const {id} = req.body;
        const product = await productService.findOnebyId(id);
        res.json({data:product});
})
//=========================Product Detail

//Verify Email
router.get('/email/verify/:token',async (req,res,next) => {
    const token = req.params.token;
    const user = await userService.getUserByEmail_code(token);
    if(!user){
        return next(new createError.Forbidden());
    }
    await userService.ActiveEmail(token);
    res.redirect("/api/v1/user/profile");
})

module.exports = router;
