const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./User');
require('./Product');
require('./Detail');
const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  code_product: { type: String },
  image_product: { type: String },
  name_product:{type:String},
  description_product: { type: String },
  price_product: { type: Number },
  quantity_product: { type: Number, required: true, default: 1 },
  color_product:{type:String},
  detailId: { type: Schema.Types.ObjectId, ref: 'Detail', required: true },
     
},{timestamps:true});

module.exports = mongoose.model('Cart', cartSchema);
