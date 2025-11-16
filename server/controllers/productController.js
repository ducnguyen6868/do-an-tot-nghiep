const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const page = req.query.page||1;
    const limit = req.query.limit||3;

    const skip= (page-1)*limit;
    
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
    } else {
      res.status(200).json({
        message: "Get products successful.", products , total
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
const deleteProduct = async(req,res)=>{
  try{
    const {productId}= req.params;
    if(!productId){
      return res.status(400).json({
        message:'Product ID is required.'
      });
    }
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      message:'Product has deleted.'
    });
  }catch(err){
    return res.status(500).json({
      message:'Server error: '+ err.message
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
      message: 'Get flashsale products successful.',flashsales
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error: ' + err.message
    });
  }

}

const patchStock = async(req,res)=>{
  try{
    const productId = req.query.productId;
    const index= req.query.index;
    const stock = req.query.stock;
    if(!productId||!index||!stock){
      return res.status(400).json({
        message:'ProductID ,index and stock are required.'
      });
    }
    const product = await Product.findById(productId);
    if(!product){
      return res.status(404).json({
        messsage:'Product not found.'
      });
    }
    product.detail[index].quantity= stock;
    await product.save();
    return res.status(200).json({
      message:'Update stock successful.'
    });
  }catch(err){
    return res.status(500).json({
      message:"Server error : "+err.message
    });
  }
}
module.exports = { getProducts, search, getProduct, deleteProduct,wishlist, 
  getTrendingProducts ,getFlashSaleProducts,
  patchStock
};