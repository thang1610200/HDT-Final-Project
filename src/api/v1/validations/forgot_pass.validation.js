const {body} = require('express-validator');
require("module-alias/register");
const UserService = require('@service/user.service');
const ResetPassService = require('@service/resetpass.service');

const checkvalidator = [body('email').custom(async (value,{req}) => {
        const user = await UserService.getOnebyEmail(value);
        if(!user){
            throw new Error("Email is Invalid");
        }
        else{
            const token = await ResetPassService.findEmail(value);
            if(token){
                throw new Error("Please check your email!");
            }
            else{
                user.TokenResetPass();
                req.reset = user;
                return true;
            }
        }
})]

module.exports = checkvalidator;