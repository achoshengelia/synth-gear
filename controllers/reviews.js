const Product = require('../models/product');
const Review = require('../models/review');
const moment = require('moment');

module.exports.createReview = async (req, res) => {
	const { id } = req.params;
	const review = new Review(req.body.review);
	const product = await Product.findById(id);
	if (!review || !product) {
		req.flash('error', 'ERROR was not found');
		return res.redirect('/products');
	}
	const datePosted = moment(new Date(Date.now())).format(
		'YYYY-MM-DD h:mm:ss a'
	);
	review.user = req.user.id;
	review.date = datePosted;
	product.reviews.push(review);
	await review.save();
	await product.save();
	res.redirect(`/products/${id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/products/${id}`);
};
