const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const OrderSchema = new mongoose.Schema({
    id: String,
    User_id: String,
    Payment_id: String,
    Coupon_id: {type: String},
    Total: Number,
    Status: String,
    isDeleted: {type: Boolean, default: false},
    Complete_at: Date,
    Delivery_at: Date,
    Create_at: Date,
    Update_at: Date
})

OrderSchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("order",OrderSchema);