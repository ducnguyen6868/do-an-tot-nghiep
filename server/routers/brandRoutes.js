const {getBrands,getBrand} =require('../controllers/brandController');

const express  = require("express");
const router = express.Router();

router.get("/:slug",getBrand);
router.get("/",getBrands);

module.exports = router;