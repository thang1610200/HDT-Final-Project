const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const OrderItemSchema = new mongoose.Schema({
    id: String,
    Order_id: String,
    Product_id: {type: String},
    Product_name: String,
    Quantity: String,
    Price: Number,
    Create_at: Date,
    Update_at: Date
})

OrderItemSchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("orderitem",OrderItemSchema);