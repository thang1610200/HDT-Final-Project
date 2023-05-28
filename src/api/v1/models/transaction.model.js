const mongoose = require("mongoose");

const TranSchema = new mongoose.Schema({
    orderId: String,
    SHD: String,
    Createtime: String
})

module.exports = mongoose.model("transaction", TranSchema);