const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./User');

const supportTicketSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending','resolved'], default: 'pending' }
}, { timestamps });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
