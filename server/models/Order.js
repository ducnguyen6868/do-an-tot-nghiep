const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  code:{type:String},
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'Recipient', required: true },
  total_amount: { type: Number, required: true },// tổng tiền trước giảm giá
  discount_amount: { type: Number, default: 0 },    // số tiền giảm giá (nếu có)
  final_amount: { type: Number },   // tổng tiền sau khi áp dụng khuyến mãi
  level: {
    type: String,
    enum: ['processing', 'shipping', 'delivered successfully', 'cancel'],
    default: 'processing'
  },
  list_products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    color:{type:String}
  }],
  promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' },
  paymentMethod: { type: String },
  status:{type:String ,enum:['unpaid', 'paid'] ,default:'unpaid'}
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
