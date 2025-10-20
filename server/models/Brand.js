const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema= new Schema({
    name:{type:String , required:true} ,
    avatar:{type:String, required:true},
    description:{type:String}
});

module.exports = mongoose.model("Brand",brandSchema);