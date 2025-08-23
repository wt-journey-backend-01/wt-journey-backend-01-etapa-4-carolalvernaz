const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// protegidas
router.post('/logout', authMiddleware, authController.logout);
router.delete('/users/:id', authMiddleware, authController.remove);

// BÔNUS
router.get('/me', authMiddleware, authController.me);

module.exports = router;
