const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/api/userController');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, UserController.index);
router.post('/store', authMiddleware, UserController.store);
router.get('/edit', authMiddleware, UserController.edit);
router.put('/update', authMiddleware, UserController.update);
router.delete('/destroy', authMiddleware, UserController.destroy);

module.exports = router;
