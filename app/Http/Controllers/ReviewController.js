const Review = require('../../Models/ReviewModel');
const AppError = require('../../Utils/AppError');
const catchAsync = require('../../Utils/CatchAsync');
const factory = require('./HandlerFactory');

exports.getReviews = catchAsync(async (req, res, next) => {
	let filter = {};
	if (req.params.tourId) filter = { tour: req.params.tourId };
    
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews
        }
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const review = await Review.create(req.body);
    
    res.status(201)
    .json({
        status: "success",
        data: {
            review
        }
    });
});

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

exports.deleteReview = factory.deleteOne(Review);
