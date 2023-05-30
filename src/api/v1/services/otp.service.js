require("module-alias/register");
const otp = require("@model/otp.model");

module.exports = {
    getByphone: async (phone) => {
        return await otp.findOne({phone});
    },
    compareOtp: async (phone, otps) => {
        const otpmodel = await otp.findOne({phone});
        return otpmodel.CompareOtp(otps);
    },
    deleteByPhone: async (phone) => {
        return await otp.deleteOne({phone});
    }
}