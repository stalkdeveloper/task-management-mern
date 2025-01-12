const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BaseController = require('../api/apiBaseController');
const { registerValidation, loginValidation } = require('../../validations/api/authValidation');
const User = require('../../models/User'); 
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


class AuthController extends BaseController {
    /**
     * Handle user registration.
     */
    register = async (req, res) => {
        try {
            const validationErrors = await registerValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
    
            const { name, username, email, password } = req.body;
    
            const existingUser = await User.findOne({ email });
            if (existingUser && !existingUser.isDeleted) {
                return this.sendError(res, 'User already exists', 400);
            }

            const newUser = new User({
                name,
                username,
                email,
                password
            });
    
            await newUser.save();
            const jwtSecret = JWT_SECRET || 'your_default_jwt_secret';
            const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: newUser._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
            const { password: _, ...userWithoutPassword } = newUser.toObject();
            return this.sendResponse(res, {
                user: userWithoutPassword,
                token,
                refreshToken
            }, 'User registered successfully', 201);
        } catch (error) {
            return this.sendError(res, 'Error during registration', 500, error.message);
        }
    };
    
    

    /**
     * Handle user login.
     */
    login = async (req, res) => {
        try {
            const validationErrors = await loginValidation(req);
            if (validationErrors) {
                return this.sendError(res, 'Validation failed', 400, validationErrors);
            }
   
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || user.isDeleted) {
                return this.sendError(res, 'Invalid credentials', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                logInfo('Password mismatch for user:', email);
                return this.sendError(res, 'Invalid email or password', 401);
            }
   
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

            const { password: _, ...userWithoutPassword } = user.toObject();
            return this.sendResponse(res, { 
                user: userWithoutPassword, 
                token,
                refreshToken
            }, 'Login successful');
        } catch (error) {
            logError('Error during login:', error.message);
            return this.sendError(res, 'Error during login', 500, error.message);
        }
    };   
    
    /**
     * Refresh the access token using the refresh token.
     */
    refreshToken = async (req, res) => {
        try {
            const { refreshToken } = req.body;
    
            if (!refreshToken) {
                return this.sendError(res, 'Refresh token is required', 400);
            }

            const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.userId);
    
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }
            const newAccessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
            return this.sendResponse(res, { accessToken: newAccessToken }, 'Token refreshed successfully');
        } catch (error) {
            return this.sendError(res, 'Error during refresh token request', 500, error.message);
        }
    };

    /**
     * Handle user logout.
     */
    logout = async (req, res) => {
        try {
            res.clearCookie('token');
            return this.sendResponse(res, null, 'Logout successful');
        } catch (error) {
            return this.sendError(res, 'Error during logout', 500, error.message);
        }
    };

    /**
     * Handle forgot password request.
     */
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }

            const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
            
            return this.sendResponse(res, null, 'Password reset instructions sent to your email');
        } catch (error) {
            return this.sendError(res, 'Error during forgot password request', 500, error.message);
        }
    };

    /**
     * Handle reset password request.
     */
    resetPassword = async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            let userId;
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.userId;
            } catch (error) {
                return this.sendError(res, 'Invalid or expired token', 400);
            }

            const user = await User.findById(userId);
            if (!user || user.isDeleted) {
                return this.sendError(res, 'User not found', 404);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            return this.sendResponse(res, null, 'Password reset successfully');
        } catch (error) {
           return this.sendError(res, 'Error during password reset', 500, error.message);
        }
    };

    /**
     * Soft delete user.
     */
    softDeleteUser = async (req, res) => {
        try {
           const { userId } = req.params;
           const user = await User.findById(userId);
           if (!user) {
               return this.sendError(res, 'User not found', 404);
           }

           await user.softDelete();
           return this.sendResponse(res, null, 'User soft-deleted successfully');
       } catch (error) {
           return this.sendError(res, 'Error during soft delete', 500, error.message);
       }
   };
}

module.exports = new AuthController();
