const express = require('express');
const {getTour, getTours, createTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan} = require('../controller/tourController');
const authController = require('../controller/authController');

const router = express.Router();

// router.param('id', checkId);

router.route('/top-5-cheap').get(aliasTopTours, getTours);

router.route('/get-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/')
    .get(authController.protect, getTours)
    .post(createTour);

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(authController.protect, authController.restrictTo('admin'), deleteTour);

module.exports = router;
