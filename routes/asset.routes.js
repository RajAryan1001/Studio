const express = require('express');
const assetController = require('../controllers/assetController'); // ✅ assetController, NOT artistController
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, assetController.getAssets);
router.post('/upload', authMiddleware, assetController.postUpload); // ✅ Changed to /upload
router.post('/:id/delete', authMiddleware, assetController.deleteAsset);

module.exports = router;