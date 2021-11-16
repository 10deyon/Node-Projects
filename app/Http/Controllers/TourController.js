const Tour = require('../../Models/TourModel');
const AppError = require('../../Utils/AppError');
const ApiFeatures = require('../../Utils/ApiFeatures');
const catchAsync = require('../../Utils/CatchAsync');
const factory = require('./HandlerFactory');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}

//ROUTE HANDLERS
exports.getTours = catchAsync(async (req, res, next) => {
    //EXECUTE QUERY
    const features = new ApiFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
});

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201)
    .json({
        status: "success",
        data: {
            tour: newTour
        }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');

    if (!tour) return next(new AppError('No tour found with this ID', 404));
    
    res.status(200).json({
        error: false,
        status: "success",
        data: {
            tour
        }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if (!tour) return next(new AppError('No tour found with this ID', 404));

    res.status(200).json({
        "status": "success",
        data: {
            tour
        }
    })
});

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) return next(new AppError('No tour found with this ID', 404));
    
//     res.status(204).json({
//         "status": "success",
//         data: null
//     });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                // _id: '$difficulty',
                // _id: '$ratingsAverage',
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },

        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // },
    ]);
    res.status(200).json({
        "status": "success",
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },

        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: {  $sum: + 1 },
                tours: { $push: '$name' }
            }
        },

        {
            $addFields: {
                month: '$_id'
            }
        },

        //This is used in removing an unrequired field from the array
        {
            $project: { _id: 0 }
        },

        {
            $sort: { numTours: -1 }
        },
        {
            $limit: 6
        }
    ]);
    res.status(200).json({
        "status": "success",
        data: {
            plan
        }
    });
});
