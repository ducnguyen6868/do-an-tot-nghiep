import { useState, useRef, useEffect } from 'react';
import {
    MessageSquare, Send, X, Clock, User
} from 'lucide-react';

// Màu thương hiệu (Teal/Xanh ngọc)
const BRAND_COLOR_CLASSES = 'bg-teal-500 hover:bg-teal-600 text-white';

// Dữ liệu giả lập tin nhắn
const initialMessages = [
    { id: 1, text: "Welcome to TIMEPIECE Support! How may I assist you today?", sender: 'Support', timestamp: '10:00 AM' },
    { id: 2, text: "I need help tracking my order (ORD-9014).", sender: 'User', timestamp: '10:02 AM' },
];

// ************************************************
// Reusable Component: Chat Modal
// ************************************************
const ChatModal = ({ onClose }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    // Cuộn xuống cuối tin nhắn khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Giả lập trả lời từ bộ phận hỗ trợ
    const simulateResponse = (userMessage) => {
        setIsTyping(true);
        setTimeout(() => {
            const botResponse = generateBotResponse(userMessage);
            const now = new Date();
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: botResponse,
                sender: 'Support',
                timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 1500); // Trả lời sau 1.5 giây
    };
    
    // Logic trả lời đơn giản hóa
    const generateBotResponse = (msg) => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes('tracking') || lowerMsg.includes('ord-9014')) {
            return "Your order ORD-9014 was shipped on 2025-10-28 and is currently in transit. The tracking link is: [Link].";
        }
        if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
            return "You can initiate a return via the 'My Orders' section in your profile within 30 days of delivery.";
        }
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            return "Hello! Thank you for reaching out. How can I help you further?";
        }
        return "I apologize, I need to connect you to a human agent. Please wait a moment.";
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const now = new Date();
        const newMessage = {
            id: messages.length + 1,
            text: input.trim(),
            sender: 'User',
            timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMessage]);
        const userMessageText = input.trim();
        setInput('');
        simulateResponse(userMessageText);
    };

    return (
        <div className="fixed bottom-20 right-6 w-2/5 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-300">
            
            {/* Header */}
            <div className={`p-4 rounded-t-xl flex justify-between items-center ${BRAND_COLOR_CLASSES}`}>
                <div className="flex items-center space-x-2">
                    <User className="w-6 h-6 p-1 bg-white rounded-full text-teal-600" />
                    <span className="font-semibold text-white">Live Support</span>
                </div>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full hover:bg-teal-700 transition"
                    title="Close Chat"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 custom-scrollbar">
                {messages.map(msg => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[75%] p-3 rounded-xl shadow-sm text-sm ${
                            msg.sender === 'User' 
                                ? 'bg-teal-500 text-white rounded-br-none' 
                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                            {msg.text}
                            <div className={`text-xs mt-1 ${msg.sender === 'User' ? 'text-teal-200' : 'text-gray-400'} flex justify-end items-center`}>
                                <Clock className="w-3 h-3 mr-1" />{msg.timestamp}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                         <div className="max-w-[75%] p-3 rounded-xl bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm text-sm">
                            <div className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-0"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        className={`p-2 rounded-full transition ${BRAND_COLOR_CLASSES} disabled:bg-gray-400`}
                        disabled={input.trim() === '' || isTyping}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

// ************************************************
// Main Component: Chat Support Wrapper (Button + Modal)
// ************************************************
export default function Chat() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            {/* 1. Chat Modal (Cửa sổ chat) */}
            {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} />}
            
            {/* 2. Floating Chat Button (Nút nổi) */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 
                    ${BRAND_COLOR_CLASSES}
                    ${isChatOpen ? 'rotate-90 scale-90' : 'hover:scale-105'}`
                }
                title={isChatOpen ? "Minimize Chat" : "Open Live Chat"}
            >
                {isChatOpen ? (
                   <></>
                ) : (
                    <MessageSquare className="w-7 h-7" />
                )}
            </button>

        </>
    );
}

