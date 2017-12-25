const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/authenticate');
const AuthController = require('../controllers/auth');

router.post('/register', (req, res, next) => {
  AuthController.register(req, res, next);
});

router.post('/login', (req, res, next) => {
  AuthController.login(req, res, next);
});

router.post('/provider', (req, res, next) => {
  AuthController.provider(req, res, next);
});

router.delete('/logout', authenticate, (req, res, next) => {
  AuthController.logout(req, res, next);
});

module.exports = router;
