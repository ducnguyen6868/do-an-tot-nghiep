const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const pointSchema= new Schema({
    table:{type:[Number] ,default:[1,1,1,1,1,1,2]},
    quantity:{type:Number , default:0},
    streak:{type:Number ,default:0},
    lastCheckIn:{type:Date , default:Date.now()},
    history:[{
        point:{type:Number},
        action:{type:String},
        time:{type:Date , default:Date.now()}
    }]
},{timestamps:true});

module.exports = mongoose.model('Point',pointSchema);