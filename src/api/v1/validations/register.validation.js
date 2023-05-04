const { body } = require('express-validator');
const UserService = require('@service/user.service');
const EmailValid = require('deep-email-validator');

const checkvalidator = [body('fullname','Empty field').notEmpty(),
                        body('email','Format is incorrect').isEmail().custom(async (value,{req}) =>{
                           const {valid} = await EmailValid.validate(value); // Kiểm tra Email có hoạt động hay không
                          if(!valid){  // Nếu không hoạt động thì bắt lỗi
                              throw new Error("Email isn't valid");
                          }
                          else{
                                const user = await UserService.getOnebyEmail(value);
                                if(user){
                                    throw new Error("Email already exists");
                                }
                                return true;
                           }
                        }), 
                        body('password','Password must be longer than 8 characters').isLength({min: 8}),
                        body('confirm').custom((value,{req}) => {
                        if(value !== req.body.password){
                            throw new Error("Password confirmation doesn't match password");
                        }
                        return true;
                        })];


module.exports = checkvalidator;

