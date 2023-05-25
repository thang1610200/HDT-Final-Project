const express = require("express");
require("module-alias/register");
const multer = require('multer');
const Author = require("@middleware/Author.middleware");
const productService = require("@service/product.service");
const categoryService = require("@service/category.service");
const listimageService = require("@service/listimage.service");
const couponService = require("@service/coupon.service");
const orderService = require("@service/order.service");
const drive = require("@util/drive");
const {format} = require('date-fns');
const router = express.Router();

const upload = multer();
router.use(Author.verifyToken);
router.use(Author.checkURLadmin);
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

//==========================List Image
router.get("/listimage/:id", async (req,res) => {
    const productId = await productService.findOnebyId(req.params.id);
    if(!productId){
        return res.redirect(req.baseUrl + '/product');
    }
    const listimage = await listimageService.findbyProductId(req.params.id);
    res.render("listimage",{data: productId, image: listimage, format: format});
})
    .post("/listimage",upload.single("file_upload"), async (req,res) => {
        const {product_id} = req.body;
        const file = await drive.uploadFile(req.file);
        await listimageService.createImage(product_id,file.id);
        return res.redirect(req.baseUrl + '/listimage/'+req.body.product_id);
})
    .post("/listimage/edit_infor", async (req,res) => {
        const listimage = await listimageService.findbyId(req.body.id);
        res.json({data:listimage});
})
    .post("/listimage/main_image", async (req,res) => {
        await listimageService.updateMain_Image(req.body.id, req.body.product_id);
        res.json({data:"OK"});
})
    .post("/edit_listimage", upload.single("photo"),async (req,res) => {
        const {listimage_id_edit, product_id} = req.body;
        const file = await drive.uploadFile(req.file);
        await listimageService.updateImage(listimage_id_edit,file.id);
        return res.redirect(req.baseUrl + '/listimage/'+product_id);
})
    .post("/del_listimage", upload.single("photo"),async (req,res) => {
        const {listimage_id_delete, product_id} = req.body;
        await listimageService.dellistimage(listimage_id_delete);
        return res.redirect(req.baseUrl + '/listimage/'+product_id);
})

//=========================Coupon
router.get("/coupon", async (req,res) => {
    const coupon = await couponService.getAll();
    res.render("coupon", {coupon: coupon,format: format});
})
    .post("/coupon", async (req,res) => {
        const {code, value, start_date, end_date, quantity} = req.body;
        await couponService.createCoupon(code, value, new Date(start_date), new Date(end_date), quantity);
        res.redirect(req.baseUrl + '/coupon');
})
    .post("/coupon/edit_infor", async (req,res) => {
        const coupon = await couponService.getCouponById(req.body.id);
        return res.json({"data": coupon});
})
    .post("/check_code", async (req,res) => {
        const coupon = await couponService.getCouponByCode(req.body.content);
        if(coupon){
            return res.json({"status":"No"});
        }
        else{
            return res.json({"status": "OK"});
        }
})
    .post("/edit_coupon", async (req,res) => {
        const {coupon_id_edit, code_edit, value_edit, start_date_edit, end_date_edit, quantity_edit} = req.body;
        await couponService.updateCoupon(coupon_id_edit, code_edit, value_edit, new Date(start_date_edit), new Date(end_date_edit), quantity_edit);
        res.redirect(req.baseUrl + '/coupon');
})
    .post("/delete_coupon", async (req,res) => {
        await couponService.deleteCoupon(req.body.coupon_id_delete);
        res.redirect(req.baseUrl + '/coupon');
})
//====================Coupon

//========================Order
router.get("/order", async (req,res) => {
    const order = await orderService.getInforOrders();
    res.render("order",{order: order, format: format});
})
    .post("/order/browser", async (req,res) => {
        const {id} = req.body; 
        const order = await orderService.getInforOrdersByID(id);
        res.json({data: order});
})
    .post("/order", async (req,res) => {
        const {order_id_edit, start_date} = req.body;
        await await orderService.updateDeliveryTimeOrder(order_id_edit, new Date(start_date));
        res.redirect("/api/v1/admin/order");
})

router.get("/order_item/:orderId", async (req,res) => {
    const orderId = req.params.orderId;
    const order = await orderService.getOrderItemByOrderId(orderId);
    if(order.length === 0){
        return res.redirect("/api/v1/admin/order");
    }
    return res.render("order_item", {order: order, format: format});
})



module.exports = router;