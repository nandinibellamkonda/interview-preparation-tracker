const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  updateRoundStatus,
} = require('../controllers/companyTrackerController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', listCompanies);
router.get('/:id', getCompany);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);
router.put('/:id/round-status', updateRoundStatus);

module.exports = router;
