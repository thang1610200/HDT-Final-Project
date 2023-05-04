const {body} = require("express-validator");
const UserService = require('@service/user.service');

const checkvalidator = [body('email').custom(async (value,{req}) => {
                            const user = await UserService.getOnebyEmail(value);
                            if(user){
                                if(user.ComparePass(req.body.password)){
                                    try{
                                         req.token = await user.GenerateAccessToken();
                                    }
                                    catch(e){
                                        console.error(e);
                                    }
                                    return true;
                                }
                                else{
                                    throw new Error("Incorrect password");
                                }
                            }
                            else{
                                throw new Error("Email is Invalid");
                             }

                        })];

module.exports = checkvalidator;