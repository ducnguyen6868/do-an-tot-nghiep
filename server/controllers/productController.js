const Product = require('../models/Product');
const Review = require('../models/Review');

const product = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("detail brand category");
    if (!products) {
      res.status(400).json({
        message: "No product found."
      });
    } else {
      res.status(200).json({
        message: "Get product successful.", products
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Server error:" + err.message
    })
  }
}

const search = async (req, res) => {
  const { keyword } = req.query;

  try {
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const regex = new RegExp(keyword, "i");

    const products = await Product.find({
      $or: [
        { code: regex },
        { name: regex },
        { description: regex },
        { target_audience: regex },
        { features: regex },
        { movement_type: regex },
        { strap_material: regex },
        { glass_material: regex },
      ],
    })
      .populate("detail brand category reviews")
      .exec();

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found",
        product: [],
      });
    }

    return res.status(200).json({
      message: "Get products successful",
      product: products,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error: " + err.message,
    });
  }
};

const detail = async (req, res) => {
  const { code } = req.query;

  try {
    if (!code) {
      return res.status(401).json({
        message: "Code is required."
      });
    }
    const product = await Product.findOne({ code }).populate("detail brand category");
    if (!product) {
      return res.status(404).json({
        message: "Product not found."
      });
    }
    const five = await Review.countDocuments({ rating: 5 });
    const four = await Review.countDocuments({ rating: 4 });
    const three = await Review.countDocuments({ rating: 3 });
    const two = await Review.countDocuments({ rating: 2 });
    const one = await Review.countDocuments({ rating: 1 });

    const stars = { five, four, three, two, one };
    return res.status(200).json({
      message: "Get product successful.", product, stars
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error: " + err.messgae
    });
  }
}

const wishlist = async (req, res) => {
  const wishlist = req.body;
  if (!wishlist) {
    return res.status(400).json({
      message: "Wishlist is require."
    });
  }
  let products = [];
  for (const wish of wishlist) {
    const product = await Product.findOne({ code: wish.code }).populate('brand detail');
    if (product) {
      products.push(product);
    }
  }

  return res.status(200).json({
    message: "Get wishlist successful",
    products,
  });
}

const getTrendingProducts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const products = await Product.find({}).populate('detail brand category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: 'Get trending products successful', products
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error:' + err
    });
  }
}

const getVibeFinderProducts = async (req, res) => {
  const { cateId } = req.params;
  if (!cateId) {
    return res.status(400).json({
      message: 'CateId is required.'
    });
  }

  try {
    const products = await Product.find({ category: cateId }).populate('detail');
    return res.status(200).json({
      message: 'Get vibe finder products successful.', products
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error:' + err.message
    });
  }
}

const getFlashSaleProducts = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 4;
  const skip = (page - 1) * limit;
  try {
    const flashsales = await Product.find({ flashSale: true })
      .populate('detail')
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      message: 'Get flashsale products successful.',flashsales
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error: ' + err.message
    });
  }

}
module.exports = { product, search, detail, wishlist, 
  getTrendingProducts, getVibeFinderProducts ,getFlashSaleProducts};