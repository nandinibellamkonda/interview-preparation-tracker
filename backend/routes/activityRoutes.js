const express = require('express');
const { listActivity } = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);
router.get('/', listActivity);
module.exports = router;
