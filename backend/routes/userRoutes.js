const express = require('express');
const router = express.Router();
const { register, login, updateProfile, updatePassword } = require('../controllers/userController');
const { getCart, addToCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes - require authentication
router.get('/cart', auth, getCart);
router.post('/cart', auth, addToCart);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, updatePassword);

module.exports = router;
