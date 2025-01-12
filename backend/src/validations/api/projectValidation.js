const Joi = require('joi');

const projectValidation = async (req) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
            'string.base': 'Name must be a string',
        }),
        description: Joi.string().optional().messages({
            'string.base': 'Description must be a string',
        }),
        /* createdBy: Joi.string().required().messages({
            'string.empty': 'Created by is required',
            'string.base': 'Created by must be a valid string (ID)',
        }), */
        status: Joi.string().valid('active', 'completed', 'on_hold').optional().messages({
            'string.base': 'Status must be a valid string',
            'any.only': 'Status must be one of "active", "completed", or "on hold"',
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

module.exports = { projectValidation };
