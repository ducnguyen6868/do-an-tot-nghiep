const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const detailSchema= new Schema({
    price: { type: Number, required: true },
    originalPrice:{type:Number , required:true},
    color:{type:String, required:true},
    quantity:{type:Number},
    sold:{type:Number , default:0}
});
module.exports = mongoose.model('Detail',detailSchema);