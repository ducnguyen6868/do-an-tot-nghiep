const {category} = require("../controllers/categoryController");
const express = require("express");

const router= express.Router();

router.get('/',category);

module.exports=router;