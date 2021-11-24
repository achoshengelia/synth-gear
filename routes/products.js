const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const {
	validateProduct,
	isLoggedIn,
	isAuthorised,
} = require('../utilities/middleware');
const {
	index,
	renderNewForm,
	createNewProduct,
	showProduct,
	renderEditForm,
	updateProduct,
	deleteProduct,
} = require('../controllers/products');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.get('/', wrapAsync(index));

router.get('/new', isLoggedIn, renderNewForm);

router.post(
	'/',
	isLoggedIn,
	upload.array('product[image]'),
	validateProduct,
	wrapAsync(createNewProduct)
);

router.get('/:id', wrapAsync(showProduct));

router.get('/:id/edit', isLoggedIn, isAuthorised, wrapAsync(renderEditForm));

router.put(
	'/:id',
	isLoggedIn,
	isAuthorised,
	upload.array('product[image]'),
	validateProduct,
	wrapAsync(updateProduct)
);

router.delete('/:id', isLoggedIn, wrapAsync(deleteProduct));

module.exports = router;
