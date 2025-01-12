const projectController = require('../../controllers/api/projectControllers');
const authenticate = require('../../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/', authenticate, projectController.index);
router.post('/store', authenticate, projectController.store);
router.get('/:id', authenticate, projectController.show);
router.get('/:id', authenticate, projectController.edit);
router.put('/:id', authenticate, projectController.update);
router.delete('/:id', authenticate, projectController.destroy);

module.exports = router;