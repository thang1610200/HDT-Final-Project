const mongoose = require("mongoose");
const {v4: uuidv4}= require("uuid");

const ImageSchema = new mongoose.Schema({
    id: String,
    Image: String,
    Main_Image: {type: Boolean, default: false},
    Product_Id: String,
    isDeleted: {type: Boolean, default: false},
    Create_at: Date,
    Update_at: Date
});

ImageSchema.pre("save", function(){
    this.id = uuidv4()
})

module.exports = mongoose.model("ListImage",ImageSchema);