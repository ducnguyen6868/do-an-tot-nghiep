const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true },
  subscribed_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
