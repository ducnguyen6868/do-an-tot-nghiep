const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  code: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: Schema.Types.ObjectId, ref: 'Recipient' },
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String },
  type: { type: String, default: "Home" },
  total_amount: { type: Number, required: true },// tổng tiền trước giảm giá
  discount_amount: { type: Number, default: 0 },    // số tiền giảm giá (nếu có)
  final_amount: { type: Number },   // tổng tiền sau khi áp dụng khuyến mãi
  status: [{
    present: {
      type: String,
      enum: ['Order Placed','Processing', 'Shipping', 'Delivered Successfully', 'Canceled'],
      default: 'Order Placed'
    }, 
    time: { type: Date, default: Date.now() }
  }],
  products: [{
    code: { type: String },
    name: { type: String },
    image: { type: String },
    quantity: { type: Number },
    color: { type: String }
  }],
  promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' },
  payment: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  paymentMethod: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
