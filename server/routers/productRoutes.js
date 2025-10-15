const {product,search,detail}= require("../controllers/productController");
const express = require('express');

const router = express.Router();

router.get('/',product);
router.get('/search',search);
router.get('/detail',detail);

module.exports= router;