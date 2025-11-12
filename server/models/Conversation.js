const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    participants: [
      {
        code: { type: String, required: true },
        fullName: { type: String },
        avatar: { type: String },
      },
    ],
    lastMessage: {
      text: { type: String },
      senderCode: { type: String },
      createdAt: { type: Date },
    },
    isRead:{type:Boolean , default:false}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
