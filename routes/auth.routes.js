const express = require('express');
const authController = require('../controllers/authController'); // ✅ authController, NOT artistController

const router = express.Router();

router.get('/', authController.getLogin);
router.post('/', authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;