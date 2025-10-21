const {product,search,detail,wishlist}= require("../controllers/productController");
const express = require('express');

const router = express.Router();

router.get('/',product);
router.get('/search',search);
router.get('/detail',detail);
router.post('/wishlist',wishlist);
module.exports= router;