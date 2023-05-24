const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const CouponitemSchema = new mongoose.Schema({
    id: String,
    Coupon_id: String, 
    User_id: String,
    isUsed: {type: Boolean, default: false},
    Create_at: Date,
    Update_at: Date
})

CouponitemSchema.pre("save", function(){
    this.id = uuidv4();
})

module.exports = mongoose.model("couponitem",CouponitemSchema);