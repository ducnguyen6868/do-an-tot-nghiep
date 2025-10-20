const User = require('../models/User');
const Cart = require('../models/Cart');

const viewCart = async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id).populate('carts');
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
    const { data } = req.body;
    const { id, code, name, image, description, quantity, color, price, detailId } = data;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!id || !code || !name || !description || quantity == null || !color || price == null) {
      return res.status(400).json({ message: "Fields are missing." });
    }

    const existingCart = await Cart.findOne({ userId, productId: id, color_product: color });

    if (existingCart) {
      existingCart.quantity_product += quantity;
      await existingCart.save();

      return res.status(200).json({
        message: "Product quantity updated in cart.",
        cart: user.carts.length
      });
    }

    const cart = await Cart.create({
      userId,
      productId: id,
      code_product: code,
      image_product: image,
      name_product: name,
      description_product: description,
      price_product: price,
      quantity_product: quantity,
      color_product: color,
      detailId
    });

    await User.findByIdAndUpdate(userId, { $push: { carts: cart._id } });
    
    return res.status(200).json({
      message: "Product added to cart successfully.",
      cart: user.carts.length+1
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
      cart:user.carts.length
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

    cart.quantity_product = quantity;
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


module.exports = { addCart, viewCart, deleteCart , updateCartQuantity };