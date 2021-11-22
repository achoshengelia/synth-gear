const { Schema, model } = require('mongoose');
const Review = require('./review');

const ProductSchema = new Schema({
	title: String,
	price: String,
	currency: String,
	description: String,
	image: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

ProductSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

module.exports = new model('Product', ProductSchema);
