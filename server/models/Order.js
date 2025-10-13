const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'Recipient', required: true },
  total_amount: { type: Number, required: true },// tổng tiền trước giảm giá
  discount_amount: { type: Number, default: 0 },    // số tiền giảm giá (nếu có)
  final_amount: { type: Number },   // tổng tiền sau khi áp dụng khuyến mãi
  order_status: { 
    type: String, 
    enum: ['đang xử lý', 'vận chuyển', 'giao hàng thành công', 'hủy'],
    default: 'đang xử lý'
  },
  list_products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
