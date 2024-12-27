const express = require('express');
const { register, login, getMe, updateMe, uploadProfilePicture, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/upload-profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;