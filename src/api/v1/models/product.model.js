const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const ProductSchema = new mongoose.Schema({
    id: String,
    Product_name: String,
    Category_id: {type: String},
    Description: String,
    Price: Number,
    Quantity: Number,
    Sold: {type: Number, default: 0},
    isDeleted: {type: Boolean, default: false},
    Create_at: Date,
    Update_at: Date
})

ProductSchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("product",ProductSchema);