const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Company Preparation
router.get('/', companyController.getAllCompanyPreps);
router.get('/:company', companyController.createOrGetCompanyPrep);
router.put('/:id/checklist', companyController.updateChecklistItem);
router.delete('/:id', companyController.deleteCompanyPrep);

module.exports = router;
