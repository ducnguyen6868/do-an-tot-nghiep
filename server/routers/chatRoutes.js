const express = require('express');
const {getConversations,getMessages,postConversation,postMessage} = require('../controllers/chatController');

const router = express.Router();

router.get('/message/:conversationId',getMessages);
router.get('/conversation',getConversations);
router.post('/create',postConversation);
router.post('/send',postMessage);


module.exports= router;
