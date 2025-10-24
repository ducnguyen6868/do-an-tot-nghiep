const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./User');
require('./Product');
require('./Detail');
const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  code: { type: String },
  image: { type: String },
  name:{type:String},
  description: { type: String },
  price: { type: Number },
  quantity: { type: Number, required: true, default: 1 },
  color:{type:String},
  detailId: { type: Schema.Types.ObjectId, ref: 'Detail', required: true },
     
},{timestamps:true});

module.exports = mongoose.model('Cart', cartSchema);
