const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: { type: String, required: true },
    banner: {
        type: String, // URL ảnh đại diện lớn (banner)
        default: "",
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    thumbnail: {
        type: String, // ảnh nhỏ (dùng ở danh sách hoặc grid)
        default: "",
    },
    description: { type: String },
    logo:{type:String},
    founding_year:{type:Number},
    headequaters:{type:String},
    website:{type:String}
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);