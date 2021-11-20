const Review = require('../Models/ReviewModel');
const factory = require('./HandlerFactory');

//THIS IS A MIDDLEWARE
exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}

exports.getReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);


// const AppError = require('../../Utils/AppError');
// const catchAsync = require('../../Utils/CatchAsync');

// exports.getReviews = catchAsync(async (req, res, next) => {
// 	let filter = {};
// 	if (req.params.tourId) filter = { tour: req.params.tourId };
    
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: 'success',
//         result: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//     const review = await Review.create(req.body);
    
//     res.status(201)
//     .json({
//         status: "success",
//         data: {
//             review
//         }
//     });
// });

// exports.getReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findById(req.params.id);

//     if (!review) return next(new AppError('No tour found with this ID', 404));
    
//     res.status(200).json({
//         error: false,
//         status: "success",
//         data: {
//             tour
//         }
//     });
// });

