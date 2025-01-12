const Joi = require('joi');

const storeHistoryValidation = async (req) => {
    const schema = Joi.object({
        task_id: Joi.string().required().messages({
            'string.empty': 'Task ID is required',
            'string.base': 'Task ID must be a valid ID',
        }),
        user_id: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'string.base': 'User ID must be a valid ID',
        }),
        changeType: Joi.string().valid('status change', 'assignment change', 'description update', 'other').required().messages({
            'string.empty': 'Change type is required',
            'any.only': 'Change type must be one of "status change", "assignment change", "description update", or "other"',
        }),
        old_value: Joi.string().optional().allow('').messages({
            'string.base': 'Old value must be a valid string',
        }),
        new_value: Joi.string().optional().allow('').messages({
            'string.base': 'New value must be a valid string',
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

const getHistoryValidation = async (req) => {
    const schema = Joi.object({
        task_id: Joi.string().required().messages({
            'string.empty': 'Task ID is required',
            'string.base': 'Task ID must be a valid ID',
        }),
    });

    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
        const extractedErrors = {};
        error.details.forEach(err => {
            extractedErrors[err.context.key] = err.message.replace(/\"/g, '');
        });
        return extractedErrors;
    }

    return null;
};

module.exports = {
    storeHistoryValidation,
    getHistoryValidation
};
