const express = require("express");
const router = express.Router();
require("module-alias/register");
const Author = require("@middleware/Author.middleware");
const productService = require("@service/product.service");
const listimageService = require("@service/listimage.service");
const cartService = require("@service/cart.service");
const categoryService = require("@service/category.service");

router.use(Author.verifyToken);
router.use(Author.checkURLuser);
router.get("/shop", async (req,res) => {
    const countProduct = await productService.findAll();
    const product = await productService.pagingAndfilterCate(1);
    const image = await listimageService.getMainImage();
    const cart = await cartService.getItembyUserId(req.user.id);
    const cate = await categoryService.catejoinProductbyDel();
    res.render("shop",{data: product, count: countProduct.length, sum_cart:cart, imagem: image, cate: cate});
})
    .post("/shop", async (req,res) => {
        const {id} = req.body;
        const product = await productService.findOnebyId(id);
        const cart = await cartService.addCart(req.user.id, product.id, product.Price);
        const cartitem = await cartService.getItembyCartId(cart.Cart_id);
        return res.json({cart: cartitem});
})
    .post("/shop/paging", async (req,res) => {
        const {page, cateFilter} = req.body;
        const image = await listimageService.getMainImage();
        const product = await productService.pagingAndfilterCate(page,cateFilter);
        const countProduct = await productService.countProductFilterCate(cateFilter);
        res.json({data: product, count: countProduct.length, imagem: image});
})
    .post("/shop/search", async (req,res) => {
        const {data} = req.body;
        const product = await productService.findProductName(new RegExp("^" + data,"i"));
        const image = await listimageService.getMainImage();
        res.json({data: product, imagem: image});
})

module.exports = router;