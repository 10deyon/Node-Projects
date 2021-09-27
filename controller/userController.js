const User = require('../models/UserModel');
const catchAsync = require('./../Services/CatchAsync');
const AppError = require('./../Services/AppError');

const filterObj = (object, ...allowedFields) => {
    const newObj = {};

    Object.keys(object).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = object[el];
    });
    
    return newObj;
}

exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        result: users.length,
        requested_at: req.requestTime,
        data: {
            users
        }
    });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Invalid route. Please user /updatePassword', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMyProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        requested_at: req.requestTime,
        message: "not available yet"
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        requested_at: req.requestTime,
        message: "not available yet"
    });
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        requested_at: req.requestTime,
        message: "not available yet"
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        requested_at: req.requestTime,
        message: "not available yet"
    });
};