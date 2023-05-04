require("module-alias/register");
const User = require("@model/user.model");

module.exports = {
    createUser: async (fullname, email,password) => {
        return await User.create({fullname, email, password});
    },
    getOnebyEmail: async (email) => {
        return await User.findOne({email});
    }
}