const Product = require('../models/Product');

const product = async (req, res) => {
    try {
        const products = await Product.find({}).populate("detail brand category");
        if (!products) {
            res.status(400).json({
                message: "No product found."
            });
        } else {
            res.status(200).json({
                message: "Get product successful.",products
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
        {target_audience:regex},
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

module.exports = {product,search};