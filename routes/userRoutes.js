const express = require('express');
const {getUser, getUsers, createUser, updateUser, deleteUser} = require('./../controller/userController');
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMyPassword);

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    // .patch(updateUser)
    .delete(deleteUser);

module.exports = router;