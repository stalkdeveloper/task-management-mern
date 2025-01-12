const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/userController');
const authenticate = require('../../middleware/authMiddleware');

router.get('/', authenticate, userController.index);
router.post('/store', authenticate, userController.store);
router.get('/edit', authenticate, userController.edit);
router.put('/update', authenticate, userController.update);
router.delete('/destroy', authenticate, userController.destroy);

module.exports = router;
