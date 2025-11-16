const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: { type: String, required: true },
    banner: {
        type: String, // URL ảnh đại diện lớn (banner)
        default: "",
    },

    thumbnail: {
        type: String, // ảnh nhỏ (dùng ở danh sách hoặc grid)
        default: "",
    },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);