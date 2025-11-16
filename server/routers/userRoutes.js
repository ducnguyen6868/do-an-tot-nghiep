const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const { forgotPassword, verifyOtp, resetPassword } = require('../controllers/otpController');
const { 
    addCart, viewCart, deleteCart,updateCartQuantity,
    addWishlist,getWishlist,removeWishlist,
    getList,patchStatusUser ,patchAvatarUser} = require('../controllers/userController');
const verifyUser = require('../middlewares/authUser');

const express = require('express');

const router = express.Router();
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.patch('/add-to-cart', verifyUser, addCart);
router.get('/view-cart', verifyUser, viewCart);
router.delete('/cart/:cartId', verifyUser, deleteCart);
router.patch('/cart/change-quantity', verifyUser, updateCartQuantity);
router.post('/wishlist/add', verifyUser, addWishlist);
router.get('/wishlist', verifyUser, getWishlist);
router.post('/wishlist/delete', verifyUser, removeWishlist);
router.get('/user',getList);
router.patch('/user/change',patchStatusUser);

module.exports = router;