const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    sender: {
        id: { type: String },
        fullName: { type: String },
        avatar: { type: String },
    },
    receiver: {
        id: { type: String },
        fullName: { type: String },
        avatar: { type: String },
    },
    text: {
        type: String,
        trim: true,
    },
    attachments: [
        {
            url: { type: String },
            type: {
                type: String,
                enum: ["image", "file", "video", "audio"],
                default: "file",
            },
        },
    ],
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Message", MessageSchema);
