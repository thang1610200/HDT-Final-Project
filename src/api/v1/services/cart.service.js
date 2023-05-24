require("module-alias/register");
const cartModel = require("@model/cart.model");
const cartitemModel = require("@model/cartitem.model");

module.exports = {
    getItembyUserId: async (userid) => { // join bảng cart với cartItem và Product
        return await cartModel.aggregate([
            {
                $lookup: {
                    from: "cartitems",
                    localField: "id",
                    foreignField: "Cart_id",
                    as: "cartdetail"
                }
            },
            {
                $match: {User_Id: userid, isDeleted: false}
            }
        ])
    },
    getCartbyUserID: async (user_id) => {  // lấy thông tin giỏ hàng của User ID
        return await cartModel.findOne({User_Id: user_id, isDeleted: false});
    },
    addCart: async (userid, productid, price) => { // thêm 1 sản phẩm vào giỏ hàng
        const cart = await cartModel.findOne({User_Id: userid, isDeleted: false});
        if(!cart){
            await cartModel.create({User_Id: userid, Create_at: new Date(), Update_at: new Date()});
        }
        const carts = await cartModel.findOne({User_Id: userid, isDeleted: false});
        return await cartitemModel.findOneAndUpdate({Cart_id: carts.id, Product_id: productid}, {$inc: {"Quantity":1}, $set: {Price: price}},{upsert: true, new: true});
    },
    getItembyCartId: async (cartId) => {           // lấy tất cả các sản phẩm trong giỏ hàng theo cartID
        return await cartitemModel.find({Cart_id: cartId});
    },
    addCartDetailProduct: async (userid, productid, price, quantity) => { // thêm 1 sản phẩm vào giỏ hàng bao gồm cả Quantity
        const cart = await cartModel.findOne({User_Id: userid, isDeleted: false});
        if(!cart){
            await cartModel.create({User_Id: userid, Create_at: new Date(), Update_at: new Date()});
        }
        const carts = await cartModel.findOne({User_Id: userid, isDeleted: false});
        return await cartitemModel.findOneAndUpdate({Cart_id: carts.id, Product_id: productid}, {$inc: {"Quantity":quantity}, $set: {Price: price}},{upsert: true, new: true});
    },
    getCartItemByProductId: async (id) => {          // lấy 1 sản phẩm trong giỏ hàng theo ProducId
        return await cartitemModel.findOne({Product_id: id});
    },
    getAllProductByUserId: async (id) => {         // lấy tất cả các sản phẩm trong giỏ hàng theo UserId 
        return await cartModel.aggregate([
            { $lookup:
                {
                  from: 'cartitems',
                  localField: 'id',
                  foreignField: 'Cart_id',
                  as: 'cartdetail'
                }
            },
        {
            $match: {isDeleted: false, User_Id: id}
        },
        {
            $unwind: "$cartdetail"
        },
        { "$addFields": { "product_id": "$cartdetail.Product_id" }},
        { $lookup:
            {
              from: 'products',
              localField: 'product_id',
              foreignField: 'id',
              as: 'productdetail'
            }
        },
        {
            $unwind: "$productdetail"
        },
        { "$addFields": { "cate_id": "$productdetail.Category_id" }},
        { $lookup:
            {
              from: 'categories',
              localField: 'cate_id',
              foreignField: 'id',
              as: 'cate_detail'
            }
        },
        {
            $unwind: "$cate_detail"
        },
        { $lookup:
            {
              from: 'listimages',
              localField: 'product_id',
              foreignField: 'Product_Id',
              as: 'image_product'
            }
        },
        {
            $unwind: "$image_product"
        },
        {
            $match: {"image_product.Main_Image": true}
        }
        ]);
    },
    updateQuantityProduct: async (cart_id, product_id, value) => {  // cập nhật số lượng sản phẩm trong giỏ hàng
        return await cartitemModel.findOneAndUpdate({Cart_id: cart_id, Product_id: product_id},{Quantity: value},{new: true});
    },
    removeProduct: async (cart_id, product_id) => {      // xóa sản phẩm trong giỏ hàng
        return await cartitemModel.findOneAndDelete({Cart_id: cart_id, Product_id: product_id},{rawResult: true});
    }
}