const crypto = require('crypto');
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const Order = require('../models/Order');
const User = require('../models/User');
const Detail = require('../models/Detail');
const axios = require('axios');

const createOrder = async (req, res) => {
    try {
        const { orderData,orderId } = req.body;
        const formData = orderData.formData;
        const productData = orderData.productData;
        const { total_amount, discount_amount, final_amount } = orderData;

        if (!formData.email) {
            return res.status(400).json({ message: 'You must login before buy product.' });
        }

        const user = await User.findOne({ email: formData.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // create new order
        const newOrder = new Order({
            code: orderId,
            user: user._id,
            recipient: formData.recipientId,
            total_amount: parseFloat(total_amount),
            discount_amount: parseFloat(discount_amount || 0),
            final_amount: parseFloat(final_amount),
            paymentMethod: formData.payment,
            list_products: productData.map(p => ({
                product: p.id,
                quantity: p.quantity,
                color:p.color
            })),
        });

        await newOrder.save();

        // Update detail
        for (const product of productData) {
            const detail = await Detail.findById(product.detailId);
            if (!detail) continue;

            const newQuantity = detail.quantity - product.quantity;
            const newSold = (detail.sold || 0) + product.quantity;

            await Detail.findByIdAndUpdate(product.detailId, {
                $set: {
                    quantity: newQuantity >= 0 ? newQuantity : 0,
                    sold: newSold,
                },
            });
        }

        res.status(201).json({
            message: 'Create order successful!',
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const payment = async (req, res) => {
    const { final_amount} = req.body;

    var partnerCode = "MOMO";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "pay with MoMo";
    var redirectUrl = "http://localhost:3000/payment-result";
    var ipnUrl = "https://acinaceous-zara-sheerly.ngrok-free.dev/order/callback";
    const rawTotal = (final_amount || "50").toString().trim();
    const totalNumber = parseFloat(rawTotal);
    const amount = Math.round(totalNumber * 25).toString();

    var requestType = "captureWallet"
    var extraData = "";

    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType

    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'vi'
    });
    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    try {
        const response = await axios(options);
        return res.status(200).json(response.data);
    } catch (err) {
        return res.status(500).json({ message: 'Server error : ' + err.message });
    }
};

const callBack = async (req, res) => {
    console.log("Call back:")
    console.log(req.body);
    return res.status(200).json();
};

const transitionStatus = async (req, res) => {

    const { orderId } = req.body;

    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    const signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId,
        signature,
        lang: 'vi'
    });
    const options = {
        method: "POST",
        url: 'https://test-payment.momo.vn/v2/gateway/api/query',
        headers: {
            'Content-Type': "application/json"
        },
        data: requestBody
    }
    try {
        const result = await axios(options);
        if(result.data.resultCode===0){
            await Order.findOneAndReplace({code:orderId},{
                $set:{
                    status:'paid'
                }
            });
        }
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Server error:" + err.message
        })
    }
};

module.exports = { createOrder,payment, callBack, transitionStatus };