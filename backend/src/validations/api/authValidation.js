const Joi = require('joi');

// Register validation schema
const registerValidation = async (req) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
        }),
        username: Joi.string().required().messages({
            'string.empty': 'Username is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
        }),
        password_confirmation: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Password confirmation does not match password',
            'string.empty': 'Password confirmation is required',
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const extractedErrors = {};
        error.details.forEach(err => {
            extractedErrors[err.context.key] = err.message.replace(/\"/g, '');
        });
        return extractedErrors;
    }

    return null;
};

const loginValidation = async (req) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Invalid email format',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const extractedErrors = {};
        error.details.forEach(err => {
            extractedErrors[err.context.key] = err.message.replace(/\"/g, '');
        });
        return extractedErrors;
    }

    return null;
};

module.exports = { registerValidation, loginValidation };