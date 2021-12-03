const multer = require('multer');
const sharp = require('sharp');

const User = require('../Models/UserModel');
const catchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');
const factory = require('./HandlerFactory');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users')
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Please upload only images!', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality:90 }).toFile(`public/img/users/${req.file.filename}`);

    next();
}

const filterObj = (object, ...allowedFields) => {
    const newObj = {};

    Object.keys(object).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = object[el];
    });
    
    return newObj;
}

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Invalid route. Please user /updatePassword', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

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
        message: "This route is not available, use /signup instead"
    });
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);



// exports.getUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find();

//     res.status(200).json({
//         status: "success",
//         result: users.length,
//         requested_at: req.requestTime,
//         data: {
//             users
//         }
//     });
// });

// exports.updateUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         requested_at: req.requestTime,
//         message: "not available yet"
//     });
// };

// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         requested_at: req.requestTime,
//         message: "not available yet"
//     });
// };


// async function listCourses() {
listCourses = async () => {
    const tours = await Tour
        .find()
        .populate('user')
        // .populate('user', 'list properties you wanna include when the collection is included and -Property to exclude');
        .select('name tour');
    
    // console.log(tours);
}