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
    addCart: async (userid, productid, price) => { // thêm 1 sản phẩm vào giỏ hàng
        const cart = await cartModel.findOne({User_Id: userid, isDeleted: false});
        if(!cart){
            await cartModel.create({User_Id: userid, Create_at: new Date(), Update_at: new Date()});
        }
        const carts = await cartModel.findOne({User_Id: userid, isDeleted: false});
        return await cartitemModel.findOneAndUpdate({Cart_id: carts.id, Product_id: productid}, {$inc: {"Quantity":1}, $set: {Price: price}},{upsert: true, new: true});
    },
    getItembyCartId: async (cartId) => {
        return await cartitemModel.find({Cart_id: cartId});
    }
}