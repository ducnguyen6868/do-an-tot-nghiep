const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./User');
const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  code:{type:String},
  slug: { type: String },
  image: { type: String },
  name:{type:String},
  color: { type: String },
  price: { type: Number },
  quantity: { type: Number, required: true, default: 1 },
},{timestamps:true});

module.exports = mongoose.model('Cart', cartSchema);
