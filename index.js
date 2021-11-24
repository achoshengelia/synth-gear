if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// Express

const express = require('express');
const app = express();
const PORT = 4000;
const path = require('path');

const AppError = require('./utilities/AppError');

// Routes

const productsRoutes = require('./routes/products');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

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

// Session & Authorisation

const session = require('express-session');
const flash = require('connect-flash');
const sessionConfig = {
	name: 'whatareyoudoinghere?',
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use('/', usersRoutes);
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
