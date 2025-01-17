const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/userController');
const authenticate = require('../../middleware/authMiddleware');
const uploadFile = require('../../utils/uploadFile');

router.get('/', authenticate, userController.index);
router.post('/store', authenticate, uploadFile('profileImage', 'image', 'uploads/images', 5), userController.store);
router.get('/edit', authenticate, userController.edit);
router.put('/update', authenticate, uploadFile('profileImage', 'image', 'uploads/images', 5), userController.update);
router.delete('/destroy', authenticate, userController.destroy);

module.exports = router;
