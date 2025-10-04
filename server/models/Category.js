const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category_name: { type: String, required: true },
  category_description: { type: String },   // Mô tả danh mục
  category_avatar: { type: String }           // Đường dẫn ảnh đại diện cho danh mục
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
