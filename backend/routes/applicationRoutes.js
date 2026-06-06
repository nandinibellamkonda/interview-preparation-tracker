const express = require('express');
const { listApplications, createApplication, updateApplication, deleteApplication } = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);
router.get('/', listApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
module.exports = router;
