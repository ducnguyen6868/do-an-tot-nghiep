const {getCollections , getCollection} = require('../controllers/collectionController');

const express = require('express');
const router = express.Router();

router.get('/:slug',getCollection);
router.get('/',getCollections);

module.exports = router;