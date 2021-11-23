const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
	body: String,
	rating: Number,
	date: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = model('Review', reviewSchema);
