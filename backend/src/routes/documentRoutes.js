const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/download/:id', documentController.downloadDocument);
router.get('/view/:id', documentController.viewDocument);

// Protected routes
router.use(protect);

router.post('/', documentController.uploadDocument);
router.get('/', documentController.getAllDocuments);
router.get('/:id', documentController.getDocument);
router.put('/:id', documentController.updateDocument);  // Make sure this exists
router.delete('/:id', documentController.deleteDocument);

module.exports = router;