require("module-alias/register");
const User = require("@model/user.model");

module.exports = {
    createUser: async (fullname, email,password) => {   // Tạo dữ liệu mới
        return await User.create({fullname, email, password});
    },
    getOnebyEmail: async (email) => {      // lọc 1 dòng theo email
        return await User.findOne({email});
    },
    createUserNoPass: async (fullname, email) => { // tạo user mới khi đăng nhập bằng FB or GG
        return await User.create({fullname, email});
    }
}