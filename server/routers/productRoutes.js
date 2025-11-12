const {getProducts,search,detail,deleteProduct,
    wishlist
    ,getTrendingProducts ,getVibeFinderProducts, getFlashSaleProducts,
    patchStock
}= require("../controllers/productController");
const express = require('express');

const router = express.Router();

router.get('/',getProducts);
router.get('/search',search);
router.get('/detail',detail);
router.delete('/delete/:productId',deleteProduct);
router.get('/trending',getTrendingProducts);
router.get('/category/:cateId',getVibeFinderProducts);
router.get('/flashsale',getFlashSaleProducts);
router.post('/wishlist',wishlist);
router.patch('/stock/update',patchStock);
module.exports= router;