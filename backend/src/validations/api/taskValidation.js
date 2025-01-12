const Joi = require('joi');

const taskValidation = async (req) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            'string.empty': 'Title is required',
            'string.base': 'Title must be a string',
        }),
        description: Joi.string().optional().messages({
            'string.base': 'Description must be a string',
        }),
        status: Joi.string().valid('not_started', 'in_progress', 'completed', 'on_hold').optional().messages({
            'string.base': 'Status must be a valid string',
            'any.only': 'Status must be one of "not started", "in progress", "completed", or "on hold"',
        }),
        assignee: Joi.string().optional().messages({
            'string.base': 'Assignee must be a valid string (ID)',
        }),
        dueDate: Joi.date().optional().messages({
            'date.base': 'Due date must be a valid date',
        }),
        project_id: Joi.string().required().messages({
            'string.empty': 'Project ID is required',
            'string.base': 'Project ID must be a valid string (ID)',
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

module.exports = { taskValidation };
