const mongoose = require('mongoose');

const RecipientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    
    address: {
        type:String,
        required:true
    },
    notes: {
        type: String,
        trim: true
    },
    paymentMethod: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Recipient = mongoose.model('Recipient', RecipientSchema);
module.exports = Recipient;
