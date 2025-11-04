const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');
const Order = require('../models/Order');

const review = async (req, res) => {
    const { user, name, codeProduct, codeOrder, rating, reviewText } = req.body;
    const { images, videos } = req.files;


    let imagesPath, videosPath, newUser;
    if (!name || !codeProduct || !codeOrder || !rating || !reviewText) {
        return res.status(400).json({
            message: "FormData missing fields."
        });
    }
    const product = await Product.findOne({ code: codeProduct });
    if (!product) {
        return res.status(404).json({
            message: 'Product not found.'
        });
    }
    if (images) {
        imagesPath = images.map(image => {
            const path = `uploads/reviews/images/` + image.filename;
            return path;
        });
    }
    if (videos) {
        videosPath = videos.map(video => {
            const path = `uploads/reviews/videos/` + video.filename;
            return path;
        });
    }

    const newReview = await Review.create({
        name,
        code:codeProduct,
        rating,
        comment: reviewText,
        images: imagesPath || [],
        videos: videosPath || []
    });
    if (user) {
        newUser = await User.findById(user);
        newReview.user = newUser._id;
        newReview.avatar = newUser.avatar;
    }
    await newReview.save();
    product.reviews += 1;

    const ratings = product.ratings;
    const count = product.reviews;

    const a = ratings * count + parseFloat(rating);
    const b = product.reviews + 1;

    const newRating = a / b;

    product.ratings = newRating;
    await product.save();

    const order = await Order.findOneAndUpdate({ code: codeOrder }, { $set: { review: true } });
    if (!order) {
        return res.status(404).json({
            message: "Order not found."
        });
    }
    await order.save();
    return res.status(200).json({
        message: 'Thank for your review.'
    });

}

const list = async (req, res) => {
    try {
        const code = req.query.code;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ code })
            .sort({ createdAt: -1 })   // review mới nhất trước
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ code });

        res.status(200).json({
            reviews,
            total,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { review, list };