const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },   // Mô tả danh mục
  avatar: { type: String }           // Đường dẫn ảnh đại diện cho danh mục
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
