require("module-alias/register");
const userService = require("@service/user.service");

// Kiểm tra user có sô điện thoại hay chưa, nếu chưa có thì in ra lỗi nếu có r thì gửi mã xác nhận
module.exports = async (req,res,next) => {
    const user = await userService.getUserbyId(req.user.id);

    if(typeof user.phone === 'undefined'){
        return res.redirect("/api/v1/user/profile");
    }
    else if(user.isPhoneActive){
        return res.redirect("/api/v1/user/profile");
    }

    next();
}