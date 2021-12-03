const mongoose = require('mongoose');
const AppError = require('../Utils/AppError');

mongoose.exports = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return next(new AppError('invalid ID', 404)); 
}