const Product = require('../models/product');
const moment = require('moment');
const review = require('../models/review');

module.exports.index = async (req, res) => {
	const products = await Product.find({});
	res.render('products/', { products });
};

module.exports.renderNewForm = (req, res) => {
	res.render('products/new');
};

module.exports.createNewProduct = async (req, res) => {
	const product = new Product(req.body.product);
	const datePosted = moment(new Date(Date.now())).format(
		'YYYY-MM-DD h:mm:ss a'
	);
	product.user = req.user.id;
	product.date = datePosted;
	await product.save();
	req.flash('success', `${product.title} was successfully added!`);
	res.redirect('products');
};

module.exports.showProduct = async (req, res) => {
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
	const productDatePosted = moment(new Date(product.date));
	for (let review of product.reviews) {
		const reviewDatePosted = moment(new Date(review.date));
		review.date = reviewDatePosted.fromNow();
	}
	product.date = productDatePosted.fromNow();
	res.render('products/show', { product });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	if (!product) {
		req.flash('error', 'Product was not found');
		return res.redirect('/products');
	}
	res.render('products/edit', { product });
};

module.exports.updateProduct = async (req, res) => {
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
};

module.exports.deleteProduct = async (req, res) => {
	const { id } = req.params;
	const deletedProduct = await Product.findByIdAndDelete(id);
	req.flash('success', `${deletedProduct.title} was successfully deleted!`);
	res.redirect('/products');
};
