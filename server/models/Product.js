const mongoose = require('mongoose');
require('./Detail');
require('./Brand');
require('./Category');
require('./Review');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  code:{type:String , default:"TPxxxx"},
  name: { type: String, required: true , unique:true },
  description: { type: String },
  detail:[{
    type:Schema.Types.ObjectId , ref:"Detail"
  }],
  images: [{ type: String }], // Danh sách đường dẫn hình ảnh
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: Schema.Types.ObjectId , ref:'Brand' },             // Thương hiệu
  target_audience: { type: String },     // Đối tượng sử dụng (nam, nữ, unisex, …)
  water_resistance: { type: String },    // Kháng nước (ví dụ: 5 ATM, 10 ATM, …)
  movement_type: { type: String },       // Loại máy (cơ, quartz, tự động, …)
  glass_material: { type: String },      // Chất liệu kính (sapphire, mineral, acrylic, …)
  strap_material: { type: String },      // Chất liệu dây (da, thép không gỉ, cao su, …)
  dial_type: { type: String },           // Loại mặt (analog, digital, hybrid, …)
  thickness: { type: Number },           // Độ dày (mm)
  power_reserve: { type: String },       // Khoảng trữ cót (ví dụ: 40 giờ, 50 giờ, …)
  features: { type: String },            // Tiện ích, tính năng bổ sung
  ratings: { type: Number, default: 0 },
  flashSale:{type:Boolean},
  flashSaleEnd:{type:Date},
  reviews:{type:Number , default:0}

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
