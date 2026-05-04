const express = require('express');
const { loginUser, getUserProfile, registerAdmin } = require('../controllers/authController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', protect, superAdmin, registerAdmin);
router.get('/profile', protect, getUserProfile);

module.exports = router;
