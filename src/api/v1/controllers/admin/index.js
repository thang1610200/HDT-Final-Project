const express = require("express");
require("module-alias/register");
const multer = require('multer');
const productService = require("@service/product.service");
const categoryService = require("@service/category.service");
const {format} = require('date-fns');
const router = express.Router();

const upload = multer();

///================Product
router.get("/product", async (req,res) => {
    const product = await productService.findAllandCategory();
    const category = await categoryService.findAll();
    res.render("product",{data:product, category: category, format: format});
})
    .post("/product", async (req,res) => {
        const {product_name, category, quantity, price, product_details } = req.body;
        await productService.createProduct(product_name, category, product_details, price, quantity);
        res.redirect(req.baseUrl + '/product');   
})
    .post("/product/edit_infor", async (req,res) => {
        const product = await productService.findAllandCategorybyId(req.body.id);
        return res.json({"data": product});
})
    .post("/check_product", async (req,res) => {
        const product = await productService.findOnebyName(req.body.content);
        if(product){
            return res.json({"status":"No"});
        }
        else{
            return res.json({"status": "OK"});
        }
})
    .post("/edit_product", async (req,res) => {
        const {product_id_edit, product_name_edit, category_edit, quantity_edit, price_edit, product_details_edit} = req.body;
        await productService.updateProduct(product_id_edit, product_name_edit, category_edit, product_details_edit, price_edit, quantity_edit);
        res.redirect(req.baseUrl + '/product');
})
    .post("/delete_product", async (req,res) => {
        await productService.deleteProduct(req.body.product_id_delete);
        res.redirect(req.baseUrl + '/product');
})
//========================/Product

//===========================Category
router.get("/category", async (req,res) => {
    const category = await categoryService. totalProductbyCate();
    res.render("category", {data: category, format: format});
})
    .post("/category", async (req,res) => {
        const name = req.body.category_name;
        await categoryService.createCategory(name);
        res.redirect(req.baseUrl + '/category');
})
    .post("/check_category", async (req,res) => {
        const category = await categoryService.findOnebyName(req.body.content);
        if(category){
            return res.json({"status":"No"});
        }
        else{
            return res.json({"status": "OK"});
        }
})
    .post("/edit_infor", async (req,res) => {
        const category = await categoryService.findOnebyId(req.body.id);
        return res.json({"data": category});
})
    .post("/edit_category", async (req,res) => {
        await categoryService.updateCategory(req.body.category_id_edit, req.body.category_name_edit);
        res.redirect(req.baseUrl + '/category');
})
    .post("/delete_category", async (req,res) => {
        await categoryService.deleteCategory(req.body.category_id_delete);
        res.redirect(req.baseUrl + '/category');
})
//=========================Category

module.exports = router;