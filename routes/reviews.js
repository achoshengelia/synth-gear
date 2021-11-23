const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utilities/wrapAsync');
const { validateReview, isLoggedIn } = require('../utilities/middleware');
const { createReview, deleteReview } = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, wrapAsync(createReview));

router.delete('/:reviewId', wrapAsync(deleteReview));

module.exports = router;
