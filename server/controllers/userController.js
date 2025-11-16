const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const viewCart = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).populate('carts');
  if (!user) {
    return res.status(404).json({
      message: "User not found."
    });
  }
  return res.status(200).json({
    message: "Get cart info successful", carts: user.carts
  })
}
const addCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart } = req.body;

    const { slug, name, image, quantity, color, price } = cart;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!slug || !name || quantity == null || !color || price == null) {
      return res.status(400).json({ message: "Fields are missing." });
    }

    const existingCart = await Cart.findOne({ userId,slug, color: color });

    if (existingCart) {
      existingCart.quantity += quantity;
      await existingCart.save();
      return res.status(200).json({
        message: "Product quantity updated in cart.",
        cart: user.carts.length
      });
    }

    const newCart = await Cart.create({
      userId, slug, name, image, price, quantity, color
    });

    await User.findByIdAndUpdate(userId, { $push: { carts: newCart._id } });
    return res.status(200).json({
      message: "Product added to cart successfully.",
      cart: user.carts.length + 1
    });
  } catch (err) {
    console.error("Add cart error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!cartId) {
      return res.status(400).json({ message: 'CartId is required.' });
    }

    user.carts.pull({ _id: cartId });
    await Cart.findByIdAndDelete(cartId);
    await user.save();

    return res.status(200).json({
      message: 'Delete product successful.',
      cart: user.carts.length
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId, quantity } = req.body;

    if (!cartId || quantity == null) {
      return res.status(400).json({ message: "Missing cartId or quantity." });
    }

    const cart = await Cart.findOne({ _id: cartId, userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    cart.quantity = quantity;
    await cart.save();

    const user = await User.findById(userId);

    return res.status(200).json({
      message: "Quantity updated successfully.",
    });
  } catch (err) {
    console.error("Update cart quantity error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const addWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, index } = req.body;

    if (!code || index < 0) {
      return res.status(400).json({
        message: "Code and index are required."
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    const isWishlist = user.wishlist.find(item => item.code === code && item.index === index);

    if (isWishlist) {
      return res.status(200).json({
        message: "Product is already on your wishlist.",
        wishlist: user.wishlist.length,
        exist: true
      });
    }

    user.wishlist.push({ code, index });
    await user.save();

    return res.status(200).json({
      message: "Product added to your wishlist.",
      wishlist: user.wishlist.length,
      exist: false
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error."
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const wishlist = user.wishlist;
    const products = [];

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const removeWishlist = async (req, res) => {
  const userId = req.user.id;
  const { code } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found."
    });
  }
  if (!code) {
    return res.status(400).json({
      message: "Code is require."
    });
  }
  user.wishlist = user.wishlist.filter(item => item.code !== code);
  await user.save();
  return res.status(200).json({
    message: "Product removed from your wishlist.",
    wishlist: user.wishlist.length
  })
}

const getList = async (req, res) => {
  try {
    const role = req.query.role;
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments({ role });
    const totalUser = await User.countDocuments({ role: 'user' });
    const totalStaff = await User.countDocuments({ role: 'admin' });

    const usersData = await User.find({ role })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      message: 'Get list user succsessful.', usersData, total, totalUser, totalStaff
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error : ' + err.message
    });
  }
}

const patchStatusUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const status = req.query.status;
    if (!userId || !status) {
      return res.status(400).json({
        message: 'UserID and status are required.'
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }
    user.status = status;
    await user.save();
    return res.status(200).json({
      message: 'Updated status.'
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error: ' + err.message
    });
  }

}



module.exports = {
  addCart, viewCart, deleteCart,
  updateCartQuantity, addWishlist, getWishlist, removeWishlist,
  getList, patchStatusUser
};