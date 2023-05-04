const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const CategorySchema = new mongoose.Schema({
    id: {type: String, default: uuidv4()},
    Category_name: String, 
    isDeleted: {type: Boolean, default: false},
    Create_at: Date,
    Update_at: Date
})

module.exports = mongoose.model("category",CategorySchema);