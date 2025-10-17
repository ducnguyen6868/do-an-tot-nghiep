const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./User');
require('./Product');
const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  color:{type:String}
},{timestamps});

module.exports = mongoose.model('Cart', cartSchema);
