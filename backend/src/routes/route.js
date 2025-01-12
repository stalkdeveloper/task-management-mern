const express = require('express');
const authRoutes = require('./api/authRoute');
const router = express.Router();

router.use('/api', authRoutes);

module.exports = router;
