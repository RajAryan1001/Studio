const express = require('express');
const artistController = require('../controllers/artistController'); // ✅ Correct controller
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes protected by auth middleware
router.get('/', authMiddleware, artistController.getArtists);
router.post('/', authMiddleware, artistController.postArtist);
router.post('/:id/delete', authMiddleware, artistController.deleteArtist);

module.exports = router;