const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./Order');
require('./Address');
require('./Cart');
require('./Point');

const userSchema = new Schema({
  id:{type:String , unique:true},
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, enum: ['banded', 'normal'], default: 'normal' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  last_login: { type: Date },
  resetPasswordOTP: { type: String },
  resetPasswordOTPExpiry: { type: Date },
  promotions: [{
    code: { type: String },
    status: { type: String, enum: ['not used', 'used'], default: 'not used' }
  }],
  orders: [{
    type: Schema.Types.ObjectId, ref: "Order"
  }],
  wishlist:[{code:{type:String},index:{type:Number}}],
  carts: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
  addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
  point:{type:Schema.Types.ObjectId , ref:'Point'}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
