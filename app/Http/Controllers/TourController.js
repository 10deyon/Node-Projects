const Tour = require('../../Models/TourModel');
const factory = require('./HandlerFactory');
const catchAsync = require('../../Utils/CatchAsync');
const AppError = require('../../Utils/AppError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}

exports.getDistances = catchAsync(async(req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('Provide latitude and longitude in lat,lng format', 400))
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lat * 1, lng * 1] 
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            data: distances
        }
    });
});

exports.getToursWithin = catchAsync(async(req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) {
        next(new AppError('Provide latitude and longitude in lat,lng format', 400))
    }

    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            data: tours
        }
    });
})

//ROUTE HANDLERS
exports.getTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, {path: 'reviews'});
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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
        status: "success",
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
        status: "success",
        data: {
            plan
        }
    });
});

// exports.getTours = catchAsync(async (req, res, next) => {
//     //EXECUTE QUERY
//     const features = new ApiFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//     const tours = await features.query;

//     res.status(200).json({
//         status: 'success',
//         result: tours.length,
//         data: {
//             tours
//         }
//     });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id).populate('reviews');

//     if (!tour) return next(new AppError('No tour found with this ID', 404));
    
//     res.status(200).json({
//         error: false,
//         status: "success",
//         data: {
//             tour
//         }
//     });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);
//     res.status(201)
//     .json({
//         status: "success",
//         data: {
//             tour: newTour
//         }
//     });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });
    
//     if (!tour) return next(new AppError('No tour found with this ID', 404));

//     res.status(200).json({
//         status: "success",
//         data: {
//             tour
//         }
//     })
// });


// exports.deleteTour = catchAsync(async (req, res, next) => {
//     tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) return next(new AppError('No tour found with this ID', 404));
    
//     res.status(204).json({
//         status: "success",
//         data: null
//     });
// });

