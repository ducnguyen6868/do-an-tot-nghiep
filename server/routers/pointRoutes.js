const {patch,shoping} = require('../controllers/pointController');
const express = require('express');

const router = express.Router();

router.patch('/',patch);
router.put('/shoping',shoping);

module.exports = router;