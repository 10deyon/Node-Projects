const express = require('express');
const reviewController = require('../app/Controllers/ReviewController');
const authController = require('../app/Controllers/AuthController');

const router = express.Router({ mergeParams: true });

/*
    Merge params enables routes ending with
    /tour/:id/reviews
    /reviews
    to be merged and hit the / endpoint
*/

router.use(authController.protect);

router.route('/')
    .get(reviewController.getReviews)
    .post(authController.protect, 
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
