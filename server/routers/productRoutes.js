const {getProducts,search,getProduct,deleteProduct,
    wishlist
    ,getTrendingProducts ,getVibeFinderProducts, getFlashSaleProducts,
    patchStock
}= require("../controllers/productController");
const express = require('express');

const router = express.Router();

router.get('/search',search);
router.delete('/delete/:productId',deleteProduct);
router.get('/trending',getTrendingProducts);
router.get('/flash-sale',getFlashSaleProducts);
router.post('/wishlist',wishlist);
router.patch('/stock/update',patchStock);
router.get('/:slug',getProduct);
router.get('/',getProducts);
module.exports= router;