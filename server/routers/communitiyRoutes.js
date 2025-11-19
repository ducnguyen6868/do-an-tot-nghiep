const {getCommunities} = require('../controllers/communityController');

const express = require('express');
const router = express.Router();

router.get('/',getCommunities);

module.exports = router;