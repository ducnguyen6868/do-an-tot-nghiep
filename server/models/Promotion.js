const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./Product');

const promotionSchema = new Schema({
  code: { type: String },
  titile:{type:String},
  subtitle:{type:String},
  image:{type:String},
  discount:{type:Number},
  maxDiscount:{type:Number},
  minPurchase:{type:Number},
  start:{type:Date},
  end:{type:Date},
  quantity:{type:Number},
  brand:{type:String}

}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);

