const express = require('express');
// const {getUser, getUsers, createUser, updateUser, deleteUser} = require('./../app/Http/Controllers/UserController');
const userController = require('./../app/Http/Controllers/UserController');
const authController = require('./../app/Http/Controllers/AuthController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMyPassword);
router.delete('/deleteMe', authController.protect, userController.deleteMyProfile);

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    // .patch(updateUser)
    .delete(userController.deleteUser);

module.exports = router;