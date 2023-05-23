const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const cartitemSchema = new mongoose.Schema({
    id: String,
    Cart_id: String,
    Product_id: String,
    AttributeValue_id: String,
    Quantity: {type: Number, default: 0},
    Price: Number,
    Create_at: Date,
    Update_at: Date
})

cartitemSchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("cartitem",cartitemSchema);