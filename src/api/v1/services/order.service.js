const orderModel = require("@model/order.model");
const orderitemModel = require("@model/orderitem.model");

module.exports = {
    createOrder: async (User_id, Coupon, Total) => { // khởi tạo 1 đơn hàng
        const order = await orderModel.findOne({User_id, isDeleted: false});
        if(!order){
            if(!Coupon){
                return await orderModel.create({User_id, Total});
            }
            return await orderModel.create({User_id, Coupon_id: Coupon, Total});
        }
        else{
        if(!Coupon){
            return await orderModel.findOneAndUpdate({User_id, isDeleted: false}, {Coupon_id: null, Total});
        }
        return await orderModel.findOneAndUpdate({User_id, isDeleted: false}, {Coupon_id: Coupon , Total});
    }
    },
    addItemOrder: async (Order_id, Product_id, Product_name, Quantity, Price) => {  // THêm sản phẩm vào bảng orderItem
        return await orderitemModel.create({Order_id, Product_id, Product_name, Quantity, Price, Create_at: new Date(), Update_at: new Date()});
    },
    getOrderByUserId: async (User_id) => {
        return await await orderModel.findOne({User_id, isDeleted: false});
    },
    updateOrder: async (User_id, Status) => { // cập nhật đơn hàng
        return await orderModel.updateOne({User_id, isDeleted: false},{Status, isDeleted: true, Create_at: new Date(), Update_at: new Date()});
    },
    getInforOrders: async () => {  // Lấy thông tin của tất cả các đơn hàng
        return await orderModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'User_id',
                    foreignField: 'id',
                    as: 'userdetail'
                }
            },
            {
                $unwind: "$userdetail"
            },
            {
                $lookup: {
                    from: 'coupons',
                    localField: 'Coupon_id',
                    foreignField: 'id',
                    as: 'coupondetail'
                }
            }
        ]);
    },
    getInforOrdersByID: async (orderId) => {  // Lấy thông tin của đơn hàng theo OrderId
        return await orderModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'User_id',
                    foreignField: 'id',
                    as: 'userdetail'
                }
            },
            {
                $unwind: "$userdetail"
            },
            {
                $lookup: {
                    from: 'coupons',
                    localField: 'Coupon_id',
                    foreignField: 'id',
                    as: 'coupondetail'
                }
            },{
                $match: {id: orderId}
            }
        ]);
    },
    updateDeliveryTimeOrder: async (id, date) => {   // Cập nhật thời gian vận chuyển;l
        return await orderModel.updateOne({id},{Status: "Đang vận chuyển",Delivery_at: date});
    },
    getOrderItemByOrderId: async (orderID) => {
        return orderModel.aggregate([
            {
                $lookup: {
                    from: "orderitems",
                    localField: "id",
                    foreignField: "Order_id",
                    as: "orderitemdetail"
                }
            },
            {
                $unwind: "$orderitemdetail"
            },{
                "$addFields": { "product_id": "$orderitemdetail.Product_id"}
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "id",
                    as: "productdetail"
                }
            },{
                $unwind: "$productdetail"
            },{
                "$addFields": { "cate_id": "$productdetail.Category_id"}
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "cate_id",
                    foreignField: "id",
                    as: "catedetail"
                }
            },
            {
                $unwind: "$catedetail"
            },{
                $match: {id: orderID}
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
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'User_id',
                    foreignField: 'id',
                    as: 'userdetail'
                }
            },
            {
                $unwind: "$userdetail"
            }
        ]);
    },
    getAllOrderByUserId: async (UserId) => {  // lấy thông tin các đơn hàng theo UserID
        return await orderModel.aggregate([
            {
                $match: {User_id: UserId}
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "id",
                    foreignField: "Order_id",
                    as: "orderitemdetail"
                }
            },
            {
                $unwind: "$orderitemdetail"
            },
            {
                "$addFields": { "product_id": "$orderitemdetail.Product_id"}
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "id",
                    as: "productdetail"
                }
            },{
                $unwind: "$productdetail"
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
            },{
                $group: {
                    _id: "$id",
                    infor: { $push: "$$ROOT" }
                }
            }
        ]);
    },
    getDiscountofOrderByUserID: async (UserId) => {  // Lấy thông tin coupon và Order theo User id
        return await orderModel.aggregate([
            {
                $lookup: {
                    from: 'coupons',
                    localField: 'Coupon_id',
                    foreignField: 'id',
                    as: 'coupondetail'
                }
            },{
                $match: {User_id: UserId}
            }
        ])
    },
    CancelOrder: async (orderId) => {       // hủy đơn hàng
        return await orderModel.updateOne({id: orderId},{Status: "Hủy"});
    }
}