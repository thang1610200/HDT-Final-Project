const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");

const CategorySchema = new mongoose.Schema({
    id: String,
    Category_name: String, 
    isDeleted: {type: Boolean, default: false},
    Create_at: Date,
    Update_at: Date
})

CategorySchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("category",CategorySchema);