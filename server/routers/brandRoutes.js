const {getBrands} =require('../controllers/brandController');

const express  = require("express");
const router = express.Router();

router.get("/",getBrands);

module.exports = router;