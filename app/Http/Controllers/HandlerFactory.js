const catchAsync = require('./../../Utils/CatchAsync');
const AppError = require('./../../Utils/AppError');

exports.deleteOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) return next(new AppError('No document found with this ID', 404));
        
        return res.status(204).json({
            "status": "success",
            // data: null
        });
    });
}
