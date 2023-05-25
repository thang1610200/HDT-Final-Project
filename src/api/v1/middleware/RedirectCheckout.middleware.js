require("module-alias/register");
const orderService = require("@service/order.service");

module.exports = {
    redirect_check: async (req,res,next) => {
        const order = await orderService.getOrderByUserId(req.user.id);
        if(order){
            return next();
        }
        return res.redirect("/api/v1/user/cart");
    }
}