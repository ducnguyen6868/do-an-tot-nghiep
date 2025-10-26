const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./User');
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  name:{type:String},
  avatar:{type:String},
  code:{type:String},
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  images:[{type:String}],
  videos:[{type:String}]
}, { timestamps :true });

module.exports = mongoose.model('Review', reviewSchema);
