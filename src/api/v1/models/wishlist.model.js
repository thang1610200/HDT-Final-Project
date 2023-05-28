const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const wishlistSchema = new mongoose.Schema({
    id: String,
    Product_id: String,
    User_Id: String,
    Create_at: Date,
    Update_at: Date
})

wishlistSchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("wishlist",wishlistSchema);