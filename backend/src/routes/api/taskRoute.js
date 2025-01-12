const taskController = require('../../controllers/api/taskControllers');
const authenticate = require('../../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/', authenticate, taskController.index);
router.post('/store', authenticate, taskController.store);
router.get('/:id', authenticate, taskController.show);
router.get('/:id', authenticate, taskController.edit);
router.put('/:id', authenticate, taskController.update);
router.delete('/:id', authenticate, taskController.destroy);

module.exports = router;
