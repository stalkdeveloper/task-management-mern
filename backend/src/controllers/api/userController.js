const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const BaseController = require('../../controllers/api/apiBaseController');
const { storeValidation, editValidation } = require('../../validations/api/userValidation');
const FileMetaData = require('../../models/FileMetaData');

class UserController extends BaseController {
    /**
     * Show a list of all users (for admin purposes).
     */
    index = async (req, res) => {
        try {
            const users = await User.find({ isDeleted: false });
            return this.sendResponse(res, { users }, 'Users fetched successfully');
        } catch (error) {
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
            logError('Validation', validationErrors);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
            const { name, username, email, country_code, mobile_number, password, dateofbirth } = req.body;
            
            const formattedDateOfBirth = new Date(dateofbirth);
            const onlyDate = new Date(formattedDateOfBirth.setHours(0, 0, 0, 0));

            const existingUser = await User.findOne({ email }).sort({ createdAt: -1 });
            if (existingUser && !existingUser.isDeleted) {
                return this.sendError(res, 'User already exists', 400);
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name,
                username,
                email,
                country_code,
                mobile_number,
                dateofbirth: onlyDate,
                password: hashedPassword,
            });
            await newUser.save();
            if (req.file) {
                /* const uploadData = uploadFile(req, 'image', 'uploads/images', 5);
                await new Promise((resolve, reject) => {
                    uploadData(req, res, (err) => {
                        if (err) {
                            return reject(new Error('File upload failed: ' + err.message));
                        }
                        newUser.profileImage = req.file.path;
                        // newUser.save();
                        resolve();
                    });
                }); */

                const fileMetadata = {
                    filename: req.file.filename,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    path: `uploads/images/${req.file.filename}`,
                    url: `${constants.URL.baseUrl}uploads/images/${req.file.filename}`,
                    type: 'image',
                    model: 'User',
                    modelId: newUser._id,
                    createdBy: req.user.userId,
                };
                
                const newFileMetaData = new FileMetaData(fileMetadata);
                await newFileMetaData.save();
            }
            const { password: _, ...userWithoutPassword } = newUser.toObject();
            return this.sendResponse(res, { user: userWithoutPassword }, 'User created successfully', 201);
        } catch (error) {
            return this.sendError(res, 'Error during user store', 500, error.message);
        }
    };
    
    /**
     * Show the profile of a single user (authenticated user).
     */
    show = async (req, res) => {
        try {
            const { userEmailOrId } = req.user._id;
            
            const user = await User.findByEmailOrId(userEmailOrId);
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }

            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }

            const { password, ...userWithoutPassword } = user.toObject();
            return this.sendResponse(res, { user: userWithoutPassword }, 'User profile fetched successfully');
        } catch (error) {
            return this.sendError(res, 'Error fetching user profile', 500, error.message);
        }
    };

    /**
     * Show the form to edit an existing user (typically for admin editing user details).
     */
    edit = async (req, res) => {
        try {
            const { userEmailOrId } = req.user._id;
            
            const user = await User.findByEmailOrId(userEmailOrId);
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }

            const { password, ...userWithoutPassword } = user.toObject();
            return this.sendResponse(res, { user: userWithoutPassword }, 'User profile fetched for editing');
        } catch (error) {
            return this.sendError(res, 'Error fetching user for editing', 500, error.message);
        }
    };

    /**
     * Update an existing user.
     */
    update = async (req, res) => {
        try {
            const { name, username, email } = req.body;
            const userId = req.user._id;
            const user = await User.findById(userId);
    
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }
    
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return this.sendError(res, 'Email or username already in use', 400);
            }
    
            if (req.file && user.profileImage) {
                const oldImagePath = path.join(__dirname, user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
    
            user.name = name;
            user.username = username;
            user.email = email;
            if (req.file) {
                const fileMetadata = {
                    filename: req.file.filename,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    path: `uploads/images/${req.file.filename}`,
                    url: `${constants.URL.baseUrl}uploads/images/${req.file.filename}`,
                    type: 'image',
                    model: 'User',
                    modelId: userId,
                    createdBy: req.user.userId,
                };
                const newFileMetaData = new FileMetaData(fileMetadata);
                await newFileMetaData.save();
                user.profileImage = fileMetadata.path;
            }
    
            await user.save();
            const { password, ...updatedUser } = user.toObject();
            return this.sendResponse(res, { user: updatedUser }, 'User profile updated successfully');
        } catch (error) {
            return this.sendError(res, 'Error updating user profile', 500, error.message);
        }
    };

    /**
     * Destroy (delete) a user (soft delete or hard delete).
     */
    destroy = async (req, res) => {
        try {
            const { userEmailOrId } = req.user._id;
            
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
