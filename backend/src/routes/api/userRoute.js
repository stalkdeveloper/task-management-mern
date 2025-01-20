const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/userController');
const authenticate = require('../../middleware/authMiddleware');
const uploadFile = require('../../utils/uploadFile');

router.get('/', authenticate, userController.index);
router.post('/store', authenticate, uploadFile('profileImage', 'image', 'uploads/images', 5, 1), userController.store);
router.get('/show/:userEmailOrId',authenticate, userController.show);
router.get('/edit/:userEmailOrId', authenticate, userController.edit);
router.post('/update/:userId', authenticate, uploadFile('profileImage', 'image', 'uploads/images', 5, 1), userController.update);
router.delete('/destroy/:userEmailOrId', authenticate, userController.destroy);

module.exports = router;
