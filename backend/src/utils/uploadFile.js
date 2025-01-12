const multer = require('multer');
const path = require('path');

const uploadFile = (fileFieldName, fileType = 'image', folder = 'uploads', sizeMB = 5) => {
    let allowedTypes;

    switch (fileType) {
        case 'image':
            allowedTypes = /jpeg|jpg|png|gif/;
            break;
        case 'video':
            allowedTypes = /mp4|mkv|avi|mov/;
            break;
        case 'pdf':
            allowedTypes = /pdf/;
            break;
        case 'document':
            allowedTypes = /doc|docx|xls|xlsx|ppt|pptx/;
            break;
        default:
            throw new Error('Unsupported file type');
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, folder);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            return cb(new Error(`Only ${fileType} files are allowed`), false);
        }
    };

    return multer({
        storage,
        limits: { fileSize: sizeMB * 1024 * 1024 },
        fileFilter
    }).single(fileFieldName);
};

module.exports = uploadFile;
