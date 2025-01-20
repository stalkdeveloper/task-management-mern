const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const FileMetaData = require('../../models/FileMetaData');
const BaseController = require('../../controllers/api/apiBaseController');
const { storeValidation, editValidation } = require('../../validations/api/userValidation');
const { generateFileMetadata } = require('../../utils/fileMetadataHelper');
const { extractFileMetadata, formatDateOfBirth, deleteFileIfExists } = require('../../utils/helpers');

class UserController extends BaseController {
    /**
     * Show a list of all users (for admin purposes).
     */
    index = async (req, res) => {
        try {
            const users = await User.find({ isDeleted: false });
            return this.sendResponse(res, { users }, 'Users fetched successfully');
        } catch (error) {
            logError('Error in userController index function:', error);
            return this.sendError(res, 'Error fetching users', 500, error.message);
        }
    };

    /**
     * Create a new user (usually for admins or registration endpoint).
     */
    create = async (req, res) => {
        try {

        } catch (error) {
            return this.sendError(res, 'Error during user creation', 500, error.message);
        }
    };

    store = async (req, res) => {
        try {
            const validationErrors = await storeValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }

            const { name, username, email, country_code, mobile_number, password, dateofbirth } = req.body;

            const formattedDateOfBirth = formatDateOfBirth(dateofbirth);
            const existingUser = await User.findOne({ email }).sort({ createdAt: -1 });
            if (existingUser && !existingUser.isDeleted) {
                return this.sendError(res, 'User already exists', 400);
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name, username, email, country_code, mobile_number, dateofbirth: formattedDateOfBirth, password: hashedPassword,
            });
            await newUser.save();

            let fileMetadata = null;
            if (req.file) {
                const result = await generateFileMetadata(
                    req.file, 'User', newUser._id, 'uploads/images/', req.user.userId
                );

                if (!result.success) {
                    return this.sendError(res, 'Error saving file metadata', 500, result.message);
                }

                fileMetadata = extractFileMetadata(result.data);
            }
            const { password: _, ...userWithoutPassword } = newUser.toObject();
            return this.sendResponse(res, {
                user: userWithoutPassword,
                file: fileMetadata,
            }, 'User created successfully', 201);
        } catch (error) {
            logError('Error in userController store function:', error);
            return this.sendError(res, 'Error during user store', 500, error.message);
        }
    };
    
    /**
     * Show the profile of a single user (authenticated user).
     */
    show = async (req, res) => {
        try {
            const { userEmailOrId } = req.params;
    
            if (!userEmailOrId) {
                return this.sendError(res, 'User email or ID is required', 400);
            }
    
            const user = await User.findByEmailOrId(userEmailOrId).select('-password');
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }
            const files = await user.getFiles();
            const organizedFiles = files.reduce((acc, file) => {
                acc[file.type] = acc[file.type] || [];
                // acc[file.type].push(file);
                acc[file.type].push(extractFileMetadata(file));
                return acc;
            }, {});
            const { password, isDeleted, ...userWithoutSensitiveData } = user.toObject();
            userWithoutSensitiveData.files = organizedFiles;
            return this.sendResponse(res, {
                user: userWithoutSensitiveData,
            }, 'User profile fetched successfully');
        } catch (error) {
            logError('Error in user controller show function:', error);
            return this.sendError(res, 'Error fetching user profile', 500, error.message);
        }
    };

    /**
     * Show the form to edit an existing user (typically for admin editing user details).
     */
    edit = async (req, res) => {
        try {
            const { userEmailOrId } = req.params;
    
            if (!userEmailOrId) {
                return this.sendError(res, 'User email or ID is required', 400);
            }
    
            const user = await User.findByEmailOrId(userEmailOrId).select('-password');
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }
            const files = await user.getFiles();
            const organizedFiles = files.reduce((acc, file) => {
                acc[file.type] = acc[file.type] || [];
                acc[file.type].push(extractFileMetadata(file));
                return acc;
            }, {});
            const { password, isDeleted, ...userWithoutSensitiveData } = user.toObject();
            userWithoutSensitiveData.files = organizedFiles;
            return this.sendResponse(res, {
                user: userWithoutSensitiveData,
            }, 'Successfully fetched User Data');
        } catch (error) {
            logError('Error in userController edit function:', error);
            return this.sendError(res, 'Error fetching user for editing', 500, error.message);
        }
    };

    /**
     * Update an existing user.
     */
    update = async (req, res) => {
        try {
            const validationErrors = await editValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
    
            const { userId } = req.params;
            if (!userId) {
                return this.sendError(res, 'User ID is required', 400);
            }
    
            const { name, username, email, country_code, mobile_number, dateofbirth } = req.body;
    
            const user = await User.findById(userId);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }
            const formattedDateOfBirth = dateofbirth ? formatDateOfBirth(dateofbirth) : user.dateofbirth;
            const existingImage = await user.getFiles(req.file.fieldname, true);
            if (req.file && existingImage) {
                const fileDelete = deleteFileIfExists(existingImage.path, existingImage.filename);
                if (fileDelete) {
                    await FileMetaData.deleteOne({ _id: existingImage._id });
                }
            }
    
            user.name = name;
            user.username = username;
            user.email = email;
            user.country_code = country_code;
            user.mobile_number = mobile_number;
            user.dateofbirth = formattedDateOfBirth;
            let fileMetadata = null;
            if (req.file) {
                const result = await generateFileMetadata(
                    req.file, 'User', user._id, 'uploads/images/', req.user.userId
                );
    
                if (!result.success) {
                    return this.sendError(res, 'Error saving file metadata', 500, result.message);
                }
    
                fileMetadata = extractFileMetadata(result.data);
                user.profileImage = result.data.path;
            } else {
                const file = await user.getFiles('profileImage', true);
                fileMetadata = extractFileMetadata(file)
            }

            await user.save();
            const { password, ...updatedUser } = user.toObject();
            return this.sendResponse(res, {
                user: updatedUser,
                file: fileMetadata,
            }, 'User profile updated successfully');
        } catch (error) {
            logError('Error in userController update function:', error);
            return this.sendError(res, 'Error updating user profile', 500, error.message);
        }
    };

    /**
     * Destroy (delete) a user (soft delete or hard delete).
     */
    destroy = async (req, res) => {
        try {
            const { userEmailOrId } = req.params;
            
            const user = await User.findByEmailOrId(userEmailOrId);
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }
            user.isDeleted = true;
            user.deletedAt = new Date();
            await user.save();
            return this.sendResponse(res, null, 'User deleted successfully');
        } catch (error) {
            return this.sendError(res, 'Error during user soft-delete', 500, error.message);
        }
    };
}

module.exports = new UserController();
