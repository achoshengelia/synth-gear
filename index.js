// Express

const express = require('express');
const app = express();
const PORT = 4000;
const path = require('path');

const AppError = require('./utilities/AppError');

// Router

const productsRoutes = require('./routes/products');
const reviewsRoutes = require('./routes/reviews');

// Mongoose

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

const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', productsRoutes);
app.use('/products/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
	res.render('home');
});

// Error Handlers

app.all('*', (req, res, next) => {
	next(new AppError('Page not found :(', 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) {
		return (err.message = 'Undetected Error Occured :(');
	}
	res.status(status).render('error', { err });
});

app.listen(PORT, () => {
	console.log(`Listening to port: ${PORT}`);
});
