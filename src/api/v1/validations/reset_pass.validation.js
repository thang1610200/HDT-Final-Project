const { body } = require('express-validator');

const checkvalidator = [body('password','Password must be longer than 8 characters').isLength({min: 8}),
                        body('confirm_password').custom((value,{req}) => {
                        if(value !== req.body.password){
                            throw new Error("Password confirmation doesn't match password");
                        }
                        return true;
                        })];


module.exports = checkvalidator;