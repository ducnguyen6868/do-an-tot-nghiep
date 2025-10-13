const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./User');
require('./Product');
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  images:[{type:String}],
  videos:[{type:String}]
}, { timestamps :true });

module.exports = mongoose.model('Review', reviewSchema);
