const fs = require('fs');
const path = require('path');

/**
 * Extracts relevant metadata from a file object.
 * @param {Object} file - The file object.
 * @returns {Object} - Extracted metadata.
 */
const extractFileMetadata = (file) => {
    return {
        type: file.type,
        model: file.model,
        modelId: file.modelId,
        url: file.url,
    };
};

/**
 * Deletes a file if it exists and returns a boolean indicating success or failure.
 * Uses fs.promises to handle the asynchronous operations.
 * @param {string} relativePath - The relative path to the file.
 * @param {string} imageName - The name of the image (not used here but might be useful).
 * @returns {Promise<boolean>} - True if file was deleted, false otherwise.
 */
const deleteFileIfExists = async (relativePath, filename) => {
    const filePath = path.resolve(__dirname, '..', relativePath);
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        await fs.promises.unlink(filePath);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            logError(`File not found at: ${filePath}`);
        } else {
            logError(`Error removing file: ${err.message}`);
        }
        return false;
    }
};

/**
 * Formats a date of birth string to set the time to midnight (00:00:00).
 * @param {string} dateString - The date string.
 * @returns {Date} - A Date object with the time set to midnight.
 */
const formatDateOfBirth = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.setHours(0, 0, 0, 0));
};

module.exports = {
    extractFileMetadata,
    formatDateOfBirth,
    deleteFileIfExists
};
