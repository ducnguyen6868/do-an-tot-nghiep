const crypto = require('crypto');
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const axios = require('axios');
const fillMissing = require('../utils/fillMissing');

const getOrders = async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('products')

    return res.status(200).json({
        message: "Get orders successful",
        orders
    });

}
const viewOrder = async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(400).json({
            message: "OrderId is required."
        });
    }
    const order = await Order.findOne({ code: orderId });
    if (!order) {
        return res.status(404).json({
            message: "Order not found."
        });
    } else {
        return res.status(200).json({
            message: "Get order successful.", order
        })
    }
}
const createOrder = async (req, res) => {
    try {
        const { orderData, orderId, fromCart } = req.body;
        const infoPayment = orderData.infoPayment;
        const productData = orderData.productData;
        const { total_amount, discount_amount, final_amount } = orderData;
        // Update quantity
        for (const product of productData) {
           const newProduct = await Product.findById(product.id);
           if(!newProduct) continue;
            const newQuantity = newProduct.detail[product.index].quantity - product.quantity;
            if (newQuantity < 0) {
                return res.status(403).json({
                    message: "Quantity exceeds product in stock."
                })
            }
            newProduct.detail[product.index].quantity=newQuantity;
            newProduct.detail[product.index].sold  += product.quantity;
            await newProduct.save();
        };

        // create new order
        const status = { present: 'Order Placed', time: Date.now() }
        const newOrder = new Order({
            code: orderId,
            name: infoPayment.name,
            phone: infoPayment.phone,
            address: infoPayment.address,
            type: infoPayment.type,
            total_amount: parseFloat(total_amount),
            discount_amount: parseFloat(discount_amount || 0),
            final_amount: parseFloat(final_amount),
            paymentMethod: infoPayment.payment,
            products: productData.map(p => ({
                code: p.code,
                name: p.name,
                image: p.image,
                quantity: p.quantity,
                color: p.color
            })),
        });
        newOrder.status.push(status);
        await newOrder.save();

        if (infoPayment.userId) {
            const user = await User.findById(infoPayment.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            newOrder.user = infoPayment.userId;
            await newOrder.save();
            //Delete product form cart
            if (fromCart) {
                const cartIds = user.carts.map(cart => cart._id);

                await Cart.deleteMany({ _id: { $in: cartIds } });

                user.carts = [];
                await user.save();
            };
            return res.status(201).json({
                message: 'Create order successful!',
                cart: user.carts.length
            });
        }

        res.status(201).json({
            message: 'Create order successful!',
            order: newOrder
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const payment = async (req, res) => {
    const { final_amount } = req.body;

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

const checkPayment = async (req, res) => {

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
        if (result.data.resultCode === 0) {
            await Order.findOneAndUpdate({ code: orderId }, {
                $set: {
                    payment: 'paid'
                }
            });
        }
        return res.status(200).json(result.data);
    } catch (err) {
        return res.status(500).json({
            message: "Server error:" + err.message
        })
    }
};

const listOrder = async (req, res) => {
    let { order } = req.body;
    if (!order) {
        return res.status(400).json({
            message: 'Order code is require.'
        });
    }
    const orders = await Order.find({ code: { $in: order } }).sort({ createdAt: -1 });
    return res.status(200).json({
        message: 'Get list order successful.',
        orders
    });
}

//Adminstrator 

const orders = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments({});

    return res.status(200).json({
        message: 'Get list order successful.',
        orders, total
    });
}


const changeStatus = async (req, res) => {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }
    const newStatus = { present: status, time: Date.now() }
    order.status.push(newStatus);
    await order.save();
    return res.status(200).json({
        message: 'Update status order successful.'
    });

}

const getTopSelling = async (req, res) => {
    try {
        let time = req.query.time || '7day';
        const DAY = 1000 * 60 * 60 * 24;
        time = time === '7day' ? DAY * 7 : time === '30day' ? DAY * 30 : Date.now();
        const topProducts = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.now() - time)
                    },
                    status: { $exists: true, $ne: [] },
                    $expr: {
                        $ne: [
                            { $arrayElemAt: ["$status.present", -1] },
                            "Canceled"
                        ]
                    }
                }
            },
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.code",           // gom theo mã sản phẩm
                    name: { $first: "$products.name" },
                    image: { $first: "$products.image" },
                    totalSold: { $sum: "$products.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },        // sắp xếp bán nhiều nhất
            { $limit: 6 }                        // lấy 6 sản phẩm
        ]);
        return res.status(200).json({
            message: 'Get top selling successful.',
            topProducts
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Server error : ' + err.message
        });
    }
}

const getRevenueData = async (req, res) => {
    try {
        const { range } = req.query;
        const now = new Date();
        now.setHours(23, 59, 59, 999); // End of today

        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Start of day

        // ===== 1. CALCULATE START DATE =====
        switch (range) {
            case "7days":
                startDate.setDate(now.getDate() - 6); // Today + 6 days back = 7 days
                break;
            case "30days":
                startDate.setDate(now.getDate() - 29); // Today + 29 days back = 30 days
                break;
            case "3months":
                startDate.setMonth(now.getMonth() - 3);
                break;
            case "6months":
                startDate.setMonth(now.getMonth() - 6);
                startDate.setDate(1); // Start from 1st of month
                break;
            case "alltime":
                startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2); // Start from Unix epoch
                break;
            default:
                return res.status(400).json({ message: "Invalid range parameter" });
        }

        // ===== 2. DETERMINE GROUPING STRATEGY =====
        let groupId, dateFormat, sortFields;

        if (range === "7days" || range === "30days") {
            // Group by day
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" }
            };
            dateFormat = "%Y-%m-%d";
            sortFields = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };

        } else if (range === "3months") {
            // Group by ISO week
            groupId = {
                year: { $isoWeekYear: "$createdAt" },
                week: { $isoWeek: "$createdAt" }
            };
            sortFields = { "_id.year": 1, "_id.week": 1 };

        } else {
            // Group by month (6months, alltime)
            groupId = {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" }
            };
            dateFormat = "%Y-%m";
            sortFields = { "_id.year": 1, "_id.month": 1 };
        }

        // ===== 3. AGGREGATION PIPELINE =====
        const pipeline = [
            // Stage 1: Filter orders
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: now },
                    $expr: {
                        $eq: [
                            { $arrayElemAt: ["$status.present", -1] },
                            "Delivered Successfully"
                        ]
                    }
                }
            },
            // Stage 2: Group by time period
            {
                $group: {
                    _id: groupId,
                    revenue: { $sum: "$final_amount" },
                    orders: { $sum: 1 }
                }
            },
            // Stage 3: Sort
            {
                $sort: sortFields
            },
            // Stage 4: Format output
            {
                $project: {
                    _id: 0,
                    date: buildDateExpression(range, dateFormat),
                    revenue: { $round: ["$revenue", 2] },
                    orders: 1
                }
            }
        ];

        const rawData = await Order.aggregate(pipeline);

        // ===== 4. FILL MISSING DATES =====
        const filled = fillMissing(range, startDate, rawData);

        // ===== 5. CALCULATE TOTALS =====
        const totalRevenue = filled.reduce((sum, item) => sum + item.revenue, 0);
        const totalOrders = filled.reduce((sum, item) => sum + item.orders, 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        return res.status(200).json({
            success: true,
            range,
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
            revenueData: filled,
            summary: {
                totalRevenue,
                totalOrders,
                avgOrderValue,
            }
        });

    } catch (err) {
        console.error('❌ Error in getRevenueData:', err);
        return res.status(500).json({
            success: false,
            message: "Server error: " + err.message,
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// Helper function to build date expression based on range
function buildDateExpression(range, dateFormat) {
    if (range === "3months") {
        // Format: "Week 23 2024"
        return {
            $concat: [
                "Week ",
                { $toString: "$_id.week" },
                " ",
                { $toString: "$_id.year" }
            ]
        };
    } else {
        // Format dates using $dateToString
        return {
            $dateToString: {
                format: dateFormat,
                date: {
                    $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: range === "7days" || range === "30days"
                            ? "$_id.day"
                            : 1 // Use day 1 for monthly grouping
                    }
                }
            }
        };
    }
}



module.exports = {
    getOrders, viewOrder,
    createOrder, payment, callBack, checkPayment,
    orders, listOrder, changeStatus,
    getTopSelling, getRevenueData
};