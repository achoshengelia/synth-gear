const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
	body: String,
	rating: Number,
});

module.exports = new model('Review', reviewSchema);
