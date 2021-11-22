const AppError = require('../utilities/AppError');
const { productSchema, reviewSchema } = require('../utilities/joiSchemas');

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
