const mongoose = require('mongoose');

const fileMetaDataSchema = new mongoose.Schema({
    filename: { 
        type: String, 
        required: true 
    },
    size: { 
        type: Number, 
        required: true 
    },
    mimetype: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },  /* Type of file (e.g., 'profileImage', 'document', 'video') */
    path: { 
        type: String, 
        required: true 
    },
    model: { 
        type: String, 
        required: true 
    },  /* The model associated with this file (e.g., 'User') */
    modelId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },  /* ID of the parent model (e.g., user ID, project ID) */
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },  /* Reference to the user who uploaded the file */
    url: { 
        type: String,
        required: true
    },  
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('FileMetaData', fileMetaDataSchema);
