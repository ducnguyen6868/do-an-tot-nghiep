const {
    view,
    viewOrder,
    createOrder,
    payment,
    callBack,
    checkPayment,
    orders, listOrder ,changeStatus } = require('../controllers/orderController');
const verifyUser = require('../middlewares/authUser');
const express = require('express');

const router = express.Router();
router.get('/', verifyUser, view);
router.get('/management', orders);
router.get('/:orderId', viewOrder);
router.post('/list-order',listOrder);
router.post('/create', createOrder);
router.post('/payment', payment);
router.post('/callback', callBack);
router.post('/transition-status', checkPayment);
router.patch('/status' , changeStatus);

module.exports = router;