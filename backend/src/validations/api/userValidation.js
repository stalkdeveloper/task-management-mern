const Joi = require('joi');

/* Store Validation */
const storeValidation = async (req) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
        }),
        username: Joi.string().required().messages({
            'string.empty': 'Username is required',
        }),
        dateofbirth: Joi.date().less('now').required().messages({
            'date.base': 'Please enter a valid date',
            'date.less': 'Date of birth must be a date in the past',
            'any.required': 'Date of birth is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email',
        }),
        country_code: Joi.string().min(1).max(5).required().messages({
            'string.empty': 'Country code is required',
            'string.min': 'Country code must be at least 1 character long',
            'string.max': 'Country code cannot be longer than 5 characters',
        }),
        mobile_number: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
            'string.empty': 'Mobile number is required',
            'string.pattern.base': 'Mobile number must be exactly 10 digits',
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

/* Edit Validation */
const editValidation = async (req) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Email is required',
        }),
        country_code: Joi.string().min(1).max(5).required().messages({
            'string.empty': 'Country code is required',
            'string.min': 'Country code must be at least 1 character long',
            'string.max': 'Country code cannot be longer than 5 characters',
        }),
        mobile_number: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
            'string.empty': 'Mobile number is required',
            'string.pattern.base': 'Mobile number must be exactly 10 digits',
        }),
        password: Joi.string().min(6).optional().messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
        }),
        password_confirmation: Joi.string().valid(Joi.ref('password')).optional().messages({
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

module.exports = { storeValidation, editValidation };
