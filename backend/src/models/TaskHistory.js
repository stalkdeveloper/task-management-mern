const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema({
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    changeType: {
        type: String,
        enum: ['status_change', 'assignee_change', 'description_update', 'other'],
        required: true,
    },
    old_value: {
        type: String,
        required: false,
    },
    new_value: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

taskHistorySchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = Date.now();
    await this.save();
};

taskHistorySchema.statics.findNonDeleted = function() {
    return this.find({ isDeleted: false });
};

module.exports = mongoose.model('TaskHistory', taskHistorySchema);
