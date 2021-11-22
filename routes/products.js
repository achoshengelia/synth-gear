const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const wrapAsync = require('../utilities/wrapAsync');
const { validateProduct } = require('../utilities/middleware');

router.get(
	'/',
	wrapAsync(async (req, res) => {
		const products = await Product.find({});
		res.render('products/', { products });
	})
);

router.get('/new', (req, res) => {
	res.render('products/new');
});

router.post(
	'/',
	validateProduct,
	wrapAsync(async (req, res) => {
		const product = new Product(req.body.product);
		await product.save();
		res.redirect('products');
	})
);

router.get(
	'/:id',
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		res.render('products/show', { product });
	})
);

router.get(
	'/:id/edit',
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		res.render('products/edit', { product });
	})
);

router.put(
	'/:id',
	validateProduct,
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		rm;
		const product = await Product.findByIdAndUpdate(id, {
			...req.body.product,
		});
		res.redirect(`/products/${product.id}`);
	})
);

router.delete(
	'/:id',
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const deletedProduct = await Product.findByIdAndDelete(id);
		res.redirect('/products');
	})
);

module.exports = router;
