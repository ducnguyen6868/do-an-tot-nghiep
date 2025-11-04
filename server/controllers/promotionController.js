const Promotion = require('../models/Promotion');
const User = require('../models/User');

const getPromotion = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }
        const code = user.promotions.map(pro => pro.code);
        const promotions = await Promotion.find({ code: { $in: code } });

        return res.status(200).json({
            message: 'Get promotions succesful.', promotions
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Server error: ' + err
        });
    }
}

const searchPromotion = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({
                message: "Code promotion is require."
            });
        }
        const promotion = await Promotion.findOne({
            code: { $regex: new RegExp(`^${code}$`, 'i') } // 'i' = case-insensitive
        });
        return res.status(200).json({
            message: "Get promtion sucessful.", promotion
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Server error: ' + err
        });
    }
}

module.exports = { getPromotion, searchPromotion }