require("module-alias/register");
const User = require("@model/user.model");
const bcrypt = require("bcryptjs");

module.exports = {
    createUser: async (fullname, email,password) => {   // Tạo dữ liệu mới
        return await User.create({fullname, email, password});
    },
    getOnebyEmail: async (email) => {      // lọc 1 dòng theo email
        return await User.findOne({email});
    },
    createUserNoPass: async (fullname, email) => { // tạo user mới khi đăng nhập bằng FB or GG
        return await User.create({fullname, email});
    },
    updatePass: async (email, password) => { // cập nhật lại Pass theo email
        const salts = bcrypt.genSaltSync(10);
        return await User.updateOne({email},{password: bcrypt.hashSync(password,salts),updateAt: new Date()});
    },
    updatePassbyID: async (id, password) => { // cập nhật lại Pass theo ID
        const salts = bcrypt.genSaltSync(10);
        return await User.updateOne({id},{password: bcrypt.hashSync(password,salts),updateAt: new Date()});
    },
    generateTokenByEmail: async (email) => {    // Tạo AccessToken theo email
        const user =  await User.findOne({email});
        return await user.GenerateAccessToken();
    },
    getUserbyId: async (id) => {          // Tìm User theo id
        return await User.findOne({id});
    },
    updateInfor: async (id,fullname, address, phone, avatar) => {  // cập nhật thông tin của User
        if(!avatar){
            return await User.findOneAndUpdate({id},{fullname,address, phone},{new: true});
        }
        return await User.findOneAndUpdate({id},{fullname,address, phone, avatar: avatar.id},{new: true});
    },
    updateInforNoPhone: async (id,fullname, address, avatar) => {   // cập nhật thông tin của User khi đã có phone
        if(!avatar){
            return await User.findOneAndUpdate({id},{fullname,address},{new: true});
        }
        return await User.findOneAndUpdate({id},{fullname,address, avatar: avatar.id},{new: true});
    },
    getUserByEmail_code: async (code) => {     // Tìm User theo email_code
        return await User.findOne({email_code: code});
    },
    ActiveEmail: async (code) => {  // Active email
        return await User.updateOne({email_code: code},{isEmailActive: true});
    }
}