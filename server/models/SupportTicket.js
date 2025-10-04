const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supportTicketSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  ho_ten: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['mới', 'đang xử lý', 'đã giải quyết'], default: 'mới' }
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
