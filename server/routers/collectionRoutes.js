const {getCollections} = require('../controllers/collectionController');

const express = require('express');
const router = express.Router();

router.get('/',getCollections);

module.exports = router;