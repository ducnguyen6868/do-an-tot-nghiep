const express = require('express');
const {getConversations,getMessages,postConversation,postMessage} = require('../controllers/chatController');

const router = express.Router();

router.get('/conversation',getConversations);
router.get('/message/:conversationId',getMessages);
router.post('/create',postConversation);
router.post('/send',postMessage);


module.exports= router;
