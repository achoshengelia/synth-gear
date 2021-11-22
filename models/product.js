const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
	title: String,
	price: String,
	currency: String,
	description: String,
	image: String,
});

module.exports = new model('Product', ProductSchema);
