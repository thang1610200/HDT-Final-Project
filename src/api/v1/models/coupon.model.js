const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const CouponSchema = new mongoose.Schema({
    id: String,
    Code: String, 
    Value: Number,
    Start_date: Date,
    End_date: Date,
    Quantity: Number,
    Status: {type: Boolean, default: false},
    Create_at: Date,
    Update_at: Date
})

CouponSchema.pre("save", function(){
    this.id = uuidv4();
})

module.exports = mongoose.model("coupon",CouponSchema);