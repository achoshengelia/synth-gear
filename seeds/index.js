const Product = require('../models/product');
const productsData = require('./dummyData');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/synth-gear', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const seedDB = async () => {
	await Product.deleteMany({});
	for (let product of productsData) {
		const newProduct = new Product({
			title: product.title,
			price: product.price,
			currency: product.currency,
			description: product.description,
			image: product.image,
			user: '619c02f3561902b0d602f5bb',
			date: '2021-11-18 8:30 pm',
			images: [
				{
					url: 'https://res.cloudinary.com/dqfcbw5tz/image/upload/v1637747245/Synth%20Gear/r7pzv8wesio7vvarjbbp.jpg',
					filename: 'Synth Gear/r7pzv8wesio7vvarjbbp',
				},
				{
					url: 'https://res.cloudinary.com/dqfcbw5tz/image/upload/v1637747244/Synth%20Gear/yhbjsc4mtenharinuv0d.jpg',
					filename: 'Synth Gear/yhbjsc4mtenharinuv0d',
				},
			],
		});
		await newProduct.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
