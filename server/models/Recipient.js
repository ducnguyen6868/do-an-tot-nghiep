const mongoose = require('mongoose');

const RecipientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    
    address: {
        type:String,
        required:true
    },
    type:{type:String, default:"Home"},
    isDefault:{type:Boolean , default:false}
},{timestamps:true});

const Recipient = mongoose.model('Recipient', RecipientSchema);
module.exports = Recipient;
