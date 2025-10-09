const registerController= require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const {forgotPassword,verifyOtp,resetPassword}= require('../controllers/otpController');
const express = require('express');

const router= express.Router();
router.post('/register',registerController);
router.post('/login',loginController);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp',verifyOtp);
router.post('/reset-password',resetPassword);
module.exports= router;