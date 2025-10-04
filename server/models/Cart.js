const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  added_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
