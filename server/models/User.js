const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, enum: ['chưa kích hoạt', 'đã kích hoạt'], default: 'chưa kích hoạt' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  last_login: { type: Date },
  resetPasswordOTP: { type: String },
  resetPasswordOTPExpiry: { type: Date },
  list_promotions: [{
    promotion_id: { type: Schema.Types.ObjectId, ref: 'Promotion', required: true },
    status: { type: String , enum:['chưa dùng', 'đã dùng'] , default:'chưa dùng', required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
