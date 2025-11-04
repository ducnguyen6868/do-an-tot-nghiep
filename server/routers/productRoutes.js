const {product,search,detail,wishlist
    ,getTrendingProducts ,getVibeFinderProducts, getFlashSaleProducts
}= require("../controllers/productController");
const express = require('express');

const router = express.Router();

router.get('/',product);
router.get('/search',search);
router.get('/detail',detail);
router.get('/trending',getTrendingProducts);
router.get('/category/:cateId',getVibeFinderProducts);
router.get('/flashsale',getFlashSaleProducts);
router.post('/wishlist',wishlist);
module.exports= router;