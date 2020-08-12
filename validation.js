const Joi = require('@hapi/joi');


const registerValidation = (data) => {

const registerValidationSchema = Joi.object({
    email: Joi.string().required().email(),
    username: Joi.string().required().min(4),
    password: Joi.string().required().min(6)
})

return registerValidationSchema.validate(data);
}

const loginValidation = (data) => {

    const loginValidationSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6)
    })
    
    return loginValidationSchema.validate(data);
    }
    

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;