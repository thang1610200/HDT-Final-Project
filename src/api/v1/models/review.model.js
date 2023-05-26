const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const cartSchema = new mongoose.Schema({
    id: String,
    Product_id: String,
    User_Id: String,
    rating: Number,
    content: String,
    isApproved: {type: Boolean, default: false},
    Create_at: Date,
    Update_at: Date
})

cartSchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("cart",cartSchema);