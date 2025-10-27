const {patch} = require('../controllers/pointController');
const express = require('express');

const router = express.Router();

router.patch('/',patch);

module.exports = router;