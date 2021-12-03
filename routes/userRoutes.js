const express = require('express');

const userController = require('./../app/Controllers/UserController');
const authController = require('./../app/Controllers/AuthController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMyPassword);
router.delete('/deleteMe', userController.deleteMyProfile);
router.patch('/updatePassword', authController.updatePassword);

router.use(authController.restrictTo('admin'));
router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
