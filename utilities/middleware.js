const AppError = require('../utilities/AppError');
const { productSchema, reviewSchema } = require('../utilities/joiSchemas');
const Product = require('../models/product');

module.exports.validateProduct = (req, res, next) => {
	const { error } = productSchema.validate(req.body);

	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new AppError(msg, 400);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new AppError(msg, 400);
	}
	next();
};

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in!');
		return res.redirect('/login');
	}
	next();
};

module.exports.isAuthorised = async (req, res, next) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	if (!product.user.equals(req.user.id)) {
		req.flash('error', 'You do not have the permission to do that!');
		return res.redirect(`/products/${id}`);
	}
	next();
};
