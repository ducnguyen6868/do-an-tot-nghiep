const {product,search}= require("../controllers/productController");
const express = require('express');

const router = express.Router();

router.get('/',product);
router.get('/search',search);
module.exports= router;