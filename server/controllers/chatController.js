const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({});
    return res.status(200).json({
      message: 'Get conversation successful.', conversations
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error :' + err.message
    });
  }
}

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        message: 'Conversation ID is required.'
      });
    }

    const messages = await Message.find({ conversationId: conversationId })
      .sort({ createdAt: 1 });
    return res.status(200).json({
      message: 'Get messages successful.', messages
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error : ' + err.message
    });
  }
}
const postConversation = async (req, res) => {
  const { sender, receiver } = req.body;
  if (!sender || !receiver) {
    return res.status(400).json({
      message: 'Sender and Receiver is required.'
    });
  }

  try {
    const conversation = await Conversation.create({});
    conversation.participants.push(sender, receiver);
    conversation.isRead=false;
    await conversation.save();
    return res.status(200).json({
      message: 'Create conversation succefully.', conversation
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error: ' + err.message
    });
  }

}

// Send message
const postMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.conversationId) {
      return res.status(400).json({
        message: 'Conversation ID is required.'
      });
    }
    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation`s not found.'
      });
    }
    const lastMessage = {
      text:message.text||'NULL',
      senderCode:message.sender.code||'NULL',
      createdAt:message.sender.createdAt||new Date()
    }
    conversation.isRead=false;
    conversation.lastMessage=lastMessage;
    await conversation.save();
    const newMessage = await Message.create(message);
    return res.status(200).json({
      message: 'Create message succesfully', newMessage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getConversations, getMessages, postConversation, postMessage };

