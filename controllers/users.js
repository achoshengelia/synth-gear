const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
	res.render('users/register');
};

module.exports.registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
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
};

module.exports.renderLoginForm = (req, res) => {
	res.render('users/login');
};

module.exports.loginUser = (req, res) => {
	const redirectUrl = req.session.returnTo || '/products';
	req.flash('success', 'Welcome back!');
	res.redirect(redirectUrl);
	delete req.session.returnTo;
};

module.exports.logoutUser = (req, res) => {
	req.logout();
	req.flash('success', 'See you later!');
	res.redirect('/');
};
