const express = require('express');
const reviewController = require('./../app/Http/Controllers/ReviewController');
const authController = require('./../app/Http/Controllers/AuthController');

const router = express.Router({ mergeParams: true });

/*
    Merge params enables routes ending with
    /tour/:id/reviews
    /reviews
    to be merged and hit the / endpoint
*/

router.route('/')
    .get(reviewController.getReviews)
    .post(authController.protect, 
        authController.restrictTo('user'),
        reviewController.createReview
    );

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
