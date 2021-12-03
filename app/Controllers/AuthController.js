const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../Models/UserModel');
const catchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');
const { sendEmailToUser } = require('../Utils/Email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // HEROKU SPECIFIC, test for a secure connection (make sure the proxy is set on the app.js)
        secure: req.secure || req.headers('x-forwarded-proto') === 'https'
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from data
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        data: {
            user,
        },
        token
    });
}

//ROUTE HANDLERS
exports.signUp = catchAsync(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    
    createSendToken(user, 201, req, res);
});

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Provide your email and password', 400));
    
    const user = await User.findOne({ email }).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))) return next(new AppError('Incorrect email or password', 401));

    createSendToken(user, 200, req, res);
}

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('unauthenticated user', 401));
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError('invalid user token', 401));
    
    if (currentUser.changedPasswordAfter(decoded.iat)) return new AppError('user password recently changed, please login again.', 401);

    req.user = currentUser;
    next(); 
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new AppError('unknown user with this email', 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a patch request with your new Password and passwordConfirm to: ${resetURL}. \n Ignore, if you did not request for a new password`;

    sendEmailToUser({
        email: user.email,
        subject: 'Your password reset token (valid for 10mins',
        message
    });

    // console.log({url: resetURL, reset: resetToken, user: user, message: message});
    try {
        sendEmailToUser({
            email: user.email,
            subject: 'Your password reset token (valid for 10mins',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;        
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('Error occured while sending email, please try again', 500));
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); 

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if(!user) return next(new AppError('Token is invalid or expired', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(user.correctPassword(req.body.oldPassword, user.password))) {
        return next(new AppError('Your current password is incorrect.', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, req, res);
});
