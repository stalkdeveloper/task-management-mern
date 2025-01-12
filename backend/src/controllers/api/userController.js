const User = require('../../models/User');
const BaseController = require('../../controllers/api/apiBaseController');
const { storeValidation, editValidation } = require('../../validations/api/userValidation');
const jwt = require('jsonwebtoken');
const uploadFile = require('../../utils/uploadFile');

class UserController extends BaseController {
    /**
     * Show a list of all users (for admin purposes).
     */
    index = async (req, res) => {
        try {
            const users = await User.find({ isDeleted: false }); // Only fetch active users
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
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
            const { name, username, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser && !existingUser.isDeleted) {
                return this.sendError(res, 'User already exists', 400);
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name, username, email, password: hashedPassword,
            });
            await newUser.save();
            /* const uploadData = uploadFile(req, 'image', 'uploads/images', 5);
            await new Promise((resolve, reject) => {
                uploadData(req, res, (err) => {
                    if (err) {
                        return reject(new Error('File upload failed: ' + err.message));
                    }
                    newUser.profileImage = req.file.path;
                    newUser.save();
                    resolve();
                });
            }); */
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
            const userId = req.user._id;
            const user = await User.findById(userId);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }

            const { password, ...userWithoutPassword } = user.toObject(); // Exclude password from the response
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
            const userId = req.user._id; // Assumes the user is authenticated and the user ID is in req.user
            const user = await User.findById(userId);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }

            const { password, ...userWithoutPassword } = user.toObject(); // Exclude password from the response
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
            const userId = req.user._id; // Assumes the user is authenticated and the user ID is in req.user

            const user = await User.findById(userId);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }

            // Check if the email or username is already taken by another user
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return this.sendError(res, 'Email or username already in use', 400);
            }

            // Update user information
            user.name = name;
            user.username = username;
            user.email = email;

            await user.save();

            const { password, ...updatedUser } = user.toObject();
            return this.sendResponse(res, { user: updatedUser }, 'User profile updated successfully');
        } catch (error) {
            return this.sendError(res, 'Error updating user profile', 500, error.message);
        }
    };

    /**
     * Handle profile image upload.
     */
    uploadProfileImage = async (req, res) => {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return this.sendError(res, err.message, 400);
                }

                // If the upload is successful, we can store the image URL in the user's profile
                const userId = req.user._id; // Assumes the user is authenticated
                const user = await User.findById(userId);
                if (!user || user.isDeleted) {
                    return this.sendError(res, 'User not found', 404);
                }

                // Store the image path in the user's profile
                user.profileImage = req.file.path; // Save file path in the user model
                await user.save();

                return this.sendResponse(res, { profileImage: req.file.path }, 'Profile image uploaded successfully');
            });
        } catch (error) {
            return this.sendError(res, 'Error uploading profile image', 500, error.message);
        }
    };

    /**
     * Destroy (delete) a user (soft delete or hard delete).
     */
    destroy = async (req, res) => {
        try {
            const userId = req.user._id; // Assumes the user is authenticated and the user ID is in req.user
            const user = await User.findById(userId);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }

            // Soft delete: Mark user as deleted (does not remove data from DB)
            user.isDeleted = true;
            user.deletedAt = new Date();
            await user.save();

            return this.sendResponse(res, null, 'User soft-deleted successfully');
        } catch (error) {
            return this.sendError(res, 'Error during user soft-delete', 500, error.message);
        }
    };
}

module.exports = new UserController();
