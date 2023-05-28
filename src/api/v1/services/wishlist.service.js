require("module-alias/register");
const wishlistModel = require("@model/wishlist.model");

module.exports = {
    addWishlist: async (userId, productId) => {
        const wishlist = await wishlistModel.findOne({User_Id: userId, Product_id: productId})
        if(!wishlist){
            return await wishlistModel.create({User_Id: userId, Product_id: productId, Create_at: new Date(), Update_at: new Date()});
        }
    },
    findAllByUserId: async (userId) => {
        return await wishlistModel.find({User_Id: userId});
    },
    getProductWishListbyUserId: async (userId) => {
        return await wishlistModel.aggregate([
            {
                $match: {User_Id: userId}
            },  
            {
                $lookup: {
                    from: "products",
                    localField: "Product_id",
                    foreignField: "id",
                    as: "productdetail"
                }
            },
            {
                $unwind: "$productdetail"
            },
            {
                $lookup:
                    {
                      from: 'listimages',
                      localField: 'Product_id',
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
        ])
    },
    delProductWish: async (userId, productId) => {
        return await wishlistModel.deleteOne({User_Id: userId, Product_id: productId});
    }
}