const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./Product');

const promotionSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  promo_count:{type:Number,required:true},
  min_price: { type: Number, required: true }, // mức giá tối thiểu để áp dụng khuyến mãi
  max_price: { type: Number, required: false }, // nếu có giới hạn mức giá tối đa
  promo_description: { type: String, required: false }, // mô tả chi tiết về khuyến mãi
  max_discount: { type: Number, required: false }, // mức giảm tối đa
  discount_value: { type: Number, required: true },
  applicable_products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
