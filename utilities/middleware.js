const AppError = require('../utilities/AppError');
const { productSchema } = require('../utilities/joiSchemas');

module.exports.validateProduct = (req, res, next) => {
	const { error } = productSchema.validate(req.body);

	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new AppError(msg, 400);
	}
	next();
};
