const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Only PDF and Word document uploads are allowed.'));
  },
});

router.use(authMiddleware);

router.get('/', resumeController.listResumes);
router.get('/:id', resumeController.getResumeById);
router.post('/', upload.single('resume'), resumeController.uploadResume);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
