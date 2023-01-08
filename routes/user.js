const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');


// POST route, allowing user to sign up //
router.post('/signup', userCtrl.signup);

// POST route, allowing user to login //
router.post('/login', userCtrl.login);


module.exports = router;