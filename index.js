// Express

const express = require('express');
const app = express();
const PORT = 4000;
const path = require('path');

// Router

const productsRoutes = require('./routes/products');

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

// const bootstrap = require('bootstrap');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/products', productsRoutes);

app.get('/', (req, res) => {
	res.render('home');
});

app.listen(PORT, () => {
	console.log(`Listening to port: ${PORT}`);
});
