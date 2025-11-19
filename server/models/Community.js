const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
  name:{type:String,required:true},
  avatar:{type:String},
  image: { type: String, required: true },
  comment:{type:String , required:true}
},{timestamps:true});

module.exports = mongoose.model('Community', communitySchema);
