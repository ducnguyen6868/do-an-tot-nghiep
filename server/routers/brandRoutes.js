const {brand} =require('../controllers/brandController');

const express  = require("express");
const router = express.Router();

router.get("/",brand);

module.exports = router;