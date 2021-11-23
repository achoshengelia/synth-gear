const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/product');
const Review = require('../models/review');
const wrapAsync = require('../utilities/wrapAsync');
const { validateReview, isLoggedIn } = require('../utilities/middleware');

router.post(
	'/',
	isLoggedIn,
	validateReview,
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const review = new Review(req.body.review);
		const product = await Product.findById(id);
		review.user = req.user.id;
		if (!review || !product) {
			req.flash('error', 'ERROR was not found');
			return res.redirect('/products');
		}
		product.reviews.push(review);
		await review.save();
		await product.save();
		res.redirect(`/products/${id}`);
	})
);

router.delete(
	'/:reviewId',
	wrapAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/products/${id}`);
	})
);

module.exports = router;
