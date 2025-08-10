const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require('../middleware/auth');

router.post('/signup', UserController.createUserProfile);
router.get('/me', authenticate, UserController.getUserProfile);

module.exports = router;