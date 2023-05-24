const orderModel = require("@model/order.model");
const orderitemModel = require("@model/orderitem.model");

module.exports = {
    createOrder: async (User_id, Coupon, Total) => { // khởi tạo 1 đơn hàng
        const order = await orderModel.findOne({User_id, isDeleted: false});
        if(!order){
            if(!Coupon){
                return await orderModel.create({User_id, Total, Create_at: new Date(), Update_at: new Date()});
            }
            return await orderModel.create({User_id, Coupon_id: Coupon.id, Total, Create_at: new Date(), Update_at: new Date()});
        }
        else{
        if(!Coupon){
            return await orderModel.findOneAndUpdate({User_id, isDeleted: false}, {Coupon_id: null, Total, Update_at: new Date()});
        }
        return await orderModel.findOneAndUpdate({User_id, isDeleted: false}, {Coupon_id: Coupon.id , Total, Update_at: new Date()});
    }
    },
    addItemOrder: async (Order_id, Product_id, Product_name, Quantity, Price) => {
        return await orderitemModel.findOneAndUpdate({Order_id}, {Product_id, Product_name, Quantity, Price});
    },
    getOrderByUserId: async (User_id) => {
        return await await orderModel.findOne({User_id, isDeleted: false});
    }
}