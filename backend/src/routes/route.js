const express = require('express');
const authRoutes = require('./api/authRoute');
const userRoutes = require('./api/userRoute');
const router = express.Router();

router.use('/api', authRoutes);
router.use('/api/users', userRoutes);

module.exports = router;
