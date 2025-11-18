const Product = require('../models/Product');
const imageFeatureExtractor = require('../services/imageFeatureExtractor');
const fs = require('fs').promises;


const getProducts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({});

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("detail brand category");
    if (!products) {
      res.status(400).json({
        message: "No product found."
      });
    }
    res.status(200).json({
      message: "Get products successful.", products, total
    });
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

const postProduct = async (req, res) => {
  try {
    const formData = req.body;
    if (!req.files || req.files?.length === 0) {
      return res.status(400).json({ message: 'Please upload images product.' });
    }

    // Trích xuất vector đặc trưng từ ảnh
    const imagePath = req.files[0].path;
    const imageVector = await imageFeatureExtractor.extractFeatures(imagePath);

    let detail = formData.detail;
    detail = JSON.parse(detail);
    // Tạo sản phẩm mới
    const product = new Product({
      code: 'TP' + Date.now(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      origin: formData.origin,
      target_audience: formData.target_audience,
      water_resistance: formData.water_resistance,
      movement_type: formData.movement_type,
      glass_material: formData.glass_material,
      strap_material: formData.strap_material,
      dial_type: formData.dial_type,
      thickness: formData.thickness,
      power_reserve: formData.power_reserve,
      features: formData.features,
      flashSale: formData.flashSale,
      imageVector: imageVector
    });
    const files = req.files;

    for (const file of files) {
      const imagePathName = 'uploads/products/' + file.filename;
      product.images.push(imagePathName);
    }
    product.detail = detail;

    if (formData.category) {
      product.category = formData.category;
    }
    if (formData.brand) {
      product.brand = formData.brand;
    }

    await product.save();

    res.status(201).json({
      message: 'Add product successful!.',
      product: product
    });

  } catch (error) {
    console.error('Server error :', error);
    res.status(500).json({ message: error.message });
  }
};

const postImgToSearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload image to search.' });
    }

    const limit = parseInt(req.query.limit) || 10;
    const threshold = parseFloat(req.query.threshold) || 0.5;

    // Trích xuất vector từ ảnh tìm kiếm
    const searchImagePath = req.file.path;
    const searchVector = await imageFeatureExtractor.extractFeatures(searchImagePath);

    // Lấy tất cả sản phẩm có imageVector
    const products = await Product.find({
      imageVector: { $exists: true, $ne: [] }
    });

    // Tính độ tương đồng cho từng sản phẩm
    const similarities = products.map(product => {
      const similarity = imageFeatureExtractor.cosineSimilarity(
        searchVector,
        product.imageVector
      );

      return {
        product: product,
        similarity: similarity
      };
    });

    // Lọc theo threshold và sắp xếp
    const results = similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => ({
        ...item.product.toObject(),
        similarity: (item.similarity * 100).toFixed(2) + '%'
      }));

    // Xóa file tạm
    await fs.unlink(searchImagePath);

    res.json({
      success: true,
      total: results.length,
      products: results
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: error });
  }
};


const getProduct = async (req, res) => {
  const { slug } = req.params;
  try {
    if (!slug) {
      return res.status(401).json({
        message: "Slug is required."
      });
    }
    const product = await Product.findOne({ slug }).populate("detail brand category");
    if (!product) {
      return res.status(404).json({
        message: "Product not found."
      });
    }

    return res.status(200).json({
      message: "Get product successful.", product
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error: " + err.messgae
    });
  }
}
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required.'
      });
    }
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      message: 'Product has deleted.'
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error: ' + err.message
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
    const product = await Product.findOne({ slug: wish.code }).populate('brand detail');
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
      message: 'Get flashsale products successful.', flashsales
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error: ' + err.message
    });
  }

}

const patchStock = async (req, res) => {
  try {
    const productId = req.query.productId;
    const index = req.query.index;
    const stock = req.query.stock;
    if (!productId || !index || !stock) {
      return res.status(400).json({
        message: 'ProductID ,index and stock are required.'
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        messsage: 'Product not found.'
      });
    }
    product.detail[index].quantity = stock;
    await product.save();
    return res.status(200).json({
      message: 'Update stock successful.'
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error : " + err.message
    });
  }
}
module.exports = {
  getProducts, search, getProduct, deleteProduct, wishlist,
  getTrendingProducts, getFlashSaleProducts,
  patchStock, postProduct, postImgToSearch
};