const FileMetaData = require('../models/FileMetaData');

module.exports.generateFileMetadata = async (file, model, modelId, midUrlPart, createdBy) => {
    const fileMetadata = {
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: `uploads/images/${file.filename}`,
        url: `${constants.URL.baseUrl}${midUrlPart}${file.filename}`,
        type: file.fieldname,
        model: model,
        modelId: modelId,
        createdBy: createdBy
    };

    try {
        const newFileMetaData = new FileMetaData(fileMetadata);
        const savedFileMetaData = await newFileMetaData.save();

        return {
            success: true,
            data: savedFileMetaData,
        };
    } catch (error) {
        logError('Error saving file metadata:', error);

        return {
            success: false,
            message: 'Failed to save file metadata',
            error: error.message,
        };
    }
};
