const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./Promotion');
require('./Order');
require('./Recipient');
require('./Cart');
const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, enum: ['banded', 'normal'], default: 'normal' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  last_login: { type: Date },
  resetPasswordOTP: { type: String },
  resetPasswordOTPExpiry: { type: Date },
  promotions: [{
    promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' },
    status: { type: String, enum: ['not used', 'used'], default: 'not used' }
  }],
  orders: [{
    type: Schema.Types.ObjectId, ref: "Order"
  }],
  wishlist:[{code:{type:String},index:{type:Number}}],
  carts: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
  recipients: [{ type: Schema.Types.ObjectId, ref: "Recipient" }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
