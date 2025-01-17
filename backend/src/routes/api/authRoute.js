const express = require('express');
const authController = require('../../controllers/api/authController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.delete('/soft-delete/:userEmailOrId', authenticate, authController.softDeleteUser);

module.exports = router;
