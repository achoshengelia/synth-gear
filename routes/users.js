const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utilities/wrapAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post(
	'/register',
	wrapAsync(async (req, res) => {
		try {
			const { username, email, password } = req.body;
			const user = new User({ username, email });
			const newUser = await User.register(user, password);
			req.login(newUser, (err) => {
				if (err) {
					next(err);
				} else {
					req.flash('success', 'Welcome to Synth Gear!');
					res.redirect('/');
				}
			});
		} catch (e) {
			req.flash('error', e.message);
			res.redirect('/register');
		}
	})
);

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	(req, res) => {
		const redirectUrl = req.session.returnTo || '/products';
		req.flash('success', 'Welcome back!');
		res.redirect(redirectUrl);
		delete req.session.returnTo;
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'See you later!');
	res.redirect('/');
});

module.exports = router;
