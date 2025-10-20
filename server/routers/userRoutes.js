const registerController= require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const {forgotPassword,verifyOtp,resetPassword}= require('../controllers/otpController');
const {addCart,viewCart, deleteCart,updateCartQuantity} = require('../controllers/userController');
const verifyUser= require('../middlewares/authUser');
const express = require('express');

const router= express.Router();
router.post('/register',registerController);
router.post('/login',loginController);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp',verifyOtp);
router.post('/reset-password',resetPassword);
router.patch('/add-to-cart',verifyUser,addCart);
router.get('/view-cart',verifyUser,viewCart);
router.delete('/cart/:cartId',verifyUser,deleteCart);
router.patch('/cart/change-quantity',verifyUser,updateCartQuantity);
module.exports= router;