const {body} = require('express-validator');

const checkValidator = [body('password','Password must be longer than 8 characters').isLength({min: 8}),
                        body('confirm_pass').custom((value,{req}) => {
                            if(req.body.password !== value){
                                throw new Error("Password confirmation doesn't match password");
                            }
                            else{
                                return true;
                            }
                        })]

module.exports = checkValidator;