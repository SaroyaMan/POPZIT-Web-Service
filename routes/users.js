const express = require('express'),
      router = express.Router(),
      authController = require('../controllers/authController');

router.post('/', authController.signup);

router.post('/signin', authController.signin);

module.exports = router;