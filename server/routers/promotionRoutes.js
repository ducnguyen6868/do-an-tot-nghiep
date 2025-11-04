const verifyUser = require('../middlewares/authUser');
const {getPromotion,searchPromotion} = require('../controllers/promotionController');

const express = require('express');

const router = express.Router();

router.get('/',verifyUser,getPromotion);
router.get('/search',searchPromotion);

module.exports = router;