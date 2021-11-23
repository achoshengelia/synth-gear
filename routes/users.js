const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utilities/wrapAsync');
const {
	renderRegisterForm,
	registerUser,
	renderLoginForm,
	loginUser,
	logoutUser,
} = require('../controllers/users');

router.get('/register', renderRegisterForm);

router.post('/register', wrapAsync(registerUser));

router.get('/login', renderLoginForm);

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	loginUser
);

router.get('/logout', logoutUser);

module.exports = router;
