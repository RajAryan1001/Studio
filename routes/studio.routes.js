const express = require('express');
const studioController = require('../controllers/studioController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, studioController.getStudio);
router.post('/', authMiddleware, studioController.postStudio);

module.exports = router;