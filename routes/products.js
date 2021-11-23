const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const wrapAsync = require('../utilities/wrapAsync');
const {
	validateProduct,
	isLoggedIn,
	isAuthorised,
} = require('../utilities/middleware');
const moment = require('moment');

router.get(
	'/',
	wrapAsync(async (req, res) => {
		const products = await Product.find({});
		res.render('products/', { products });
	})
);

router.get('/new', isLoggedIn, (req, res) => {
	res.render('products/new');
});

router.post(
	'/',
	isLoggedIn,
	validateProduct,
	wrapAsync(async (req, res) => {
		const product = new Product(req.body.product);
		const datePosted = moment(new Date(Date.now())).format(
			'YYYY-MM-DD h:mm:ss a'
		);
		product.user = req.user.id;
		product.date = datePosted;
		await product.save();
		req.flash('success', `${product.title} was successfully added!`);
		res.redirect('products');
	})
);

router.get(
	'/:id',
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findById(id)
			.populate({
				path: 'reviews',
				populate: {
					path: 'user',
				},
			})
			.populate('user');
		if (!product) {
			req.flash('error', 'Product was not found');
			return res.redirect('/products');
		}
		const datePosted = moment(new Date(product.date));
		product.date = datePosted.fromNow();
		res.render('products/show', { product });
	})
);

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthorised,
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			req.flash('error', 'Product was not found');
			return res.redirect('/products');
		}
		res.render('products/edit', { product });
	})
);

router.put(
	'/:id',
	isLoggedIn,
	isAuthorised,
	validateProduct,
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(id, {
			...req.body.product,
		});
		if (!product) {
			req.flash('error', 'Product was not found');
			return res.redirect('/products');
		}
		req.flash('success', `${product.title} was successfully updated!`);
		res.redirect(`/products/${product.id}`);
	})
);

router.delete(
	'/:id',
	isLoggedIn,
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const deletedProduct = await Product.findByIdAndDelete(id);
		req.flash('success', `${deletedProduct.title} was successfully deleted!`);
		res.redirect('/products');
	})
);

module.exports = router;
