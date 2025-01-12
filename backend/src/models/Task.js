const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    due_date: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started',
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

taskSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = Date.now();
    await this.save();
};

taskSchema.statics.findNonDeleted = function () {
    return this.find({ isDeleted: false });
};

taskSchema.statics.findNonDeletedById = function (taskId) {
    return this.findOne({ _id: taskId, isDeleted: false });
};

module.exports = mongoose.model('Task', taskSchema);
