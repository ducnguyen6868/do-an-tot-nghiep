const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./Product');

const collectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        banner: {
            type: String, // URL ảnh đại diện lớn (banner)
            default: "",
        },

        thumbnail: {
            type: String, // ảnh nhỏ (dùng ở danh sách hoặc grid)
            default: "",
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product", // liên kết đến bảng sản phẩm
            },
        ],

    },
    { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
