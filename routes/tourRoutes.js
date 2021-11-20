const express = require('express');

const {getTour, getTours, createTour, updateTour, deleteTour,
    aliasTopTours, getTourStats, getMonthlyPlan, getToursWithin,
    getDistances, uploadUserImages, resizeUserImages} = require('../app/Controllers/TourController');
const authController = require('../app/Controllers/AuthController');
const reviewRouter = require('./../routes/reviewRoutes')

const router = express.Router();

// console.log(reviewRouter);
// router.param('id', checkId);

router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/get-stats').get(getTourStats);
router.route('/monthly-plan/:year')
    .get(authController.protect, authController.restrictTo('admin', 'lead-guides', 'guide'), getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router.route('/')
    .get(authController.protect, getTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guides'), createTour);

router.route('/:id')
    .get(getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guides'), uploadUserImages, resizeUserImages, updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guides'), deleteTour);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
