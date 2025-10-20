const { 
    viewOrder,
    createOrder,
    payment,
    callBack,
    transitionStatus } = require('../controllers/orderController');
const express = require('express');

const router = express.Router();
router.post('/',viewOrder);
router.post('/create', createOrder);
router.post('/payment', payment);
router.post('/callback', callBack);
router.post('/transition-status', transitionStatus);

module.exports = router;