const express = require('express');
const router = express.Router();

const { loginUser } = require('../controllers/authController');

//  const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/login').post(loginUser);

module.exports = router;