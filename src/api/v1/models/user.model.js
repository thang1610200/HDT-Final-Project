const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");
const random = require("randomstring");
const bcrypt = require("bcryptjs");

const user = new mongoose.Schema({
    id: {type: String, default: uuidv4()},
    fullname: String,
    email: String,
    phone: String,
    isEmailActive: {type: Boolean, default: false},
    isPhoneActive: {type: Boolean, default: false},
    status: {type: Boolean, default: false},
    password: String,
    role: {type: String, default: 'User'},
    address: String,
    avatar: {type: String, default: "1odDXJgjRfaKMdnPY84OyOu4DU-UJ49j3"},
    email_code: String,
    phone_code: String,
    createAt: Date,
    updateAt: Date
})

user.pre('save',function() {
    const salts = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password,salts);
    this.email_code = random.generate(25);
    this.phone_code = random.generate(25);
    this.createAt = new Date();
    this.updateAt = new Date();
})

module.exports = mongoose.model("User",user);