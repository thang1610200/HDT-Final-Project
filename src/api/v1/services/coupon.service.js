const couponModel = require("@model/coupon.model");
const couponItemModel = require("@model/couponitem.model");

module.exports = {
    getAll: async () => {    // lấy tất cả coupon
        return await couponModel.find();
    },
    createCoupon: async (Code, Value, Start_date,End_date, Quantity) => {   // tạo 1 coupon
        return await couponModel.create({Code, Value, Start_date, End_date, Quantity, Create_at: new Date(), Update_at: new Date});
    },
    getCouponById :async (id) => { // lấy 1 coupon theo ID
        return await couponModel.findOne({id});
    },
    getCouponByCode :async (code) => { // lấy 1 coupon theo Code
        return await couponModel.findOne({Code: code});
    },
    updateCoupon: async (id,Code, Value, Start_date,End_date, Quantity) => { // cập nhật Coupon
        return await couponModel.updateOne({id},{Code, Value, Start_date, End_date, Quantity, Update_at: new Date});
    },
    deleteCoupon: async (id) => { // Cập nhật Status của Coupon là true
        return await couponModel.updateOne({id},{Status: true});
    },
    getItemByUserIDAndCode: async (userId, couponId) => {     // lấy thông tin trong bảng Coupon Item theo UserId và CouponID và isUsed
        return await couponItemModel.findOne({Coupon_id: couponId, User_id: userId, isUsed: true});
    },
    createCouponItem: async (Coupon_id, User_id) => {  // thêm dữ liệu vào bảng Coupon Item
        return await couponItemModel.create({Coupon_id, User_id, isUsed: true});
    }

}