import { useState, useRef, useEffect, useContext } from 'react';
import {
    MessageSquare, Send, X, User
} from 'lucide-react';
import { UserContext } from '../../contexts/UserContext';
import io from "socket.io-client";
import profileApi from '../../api/profileApi';
import chatApi from '../../api/chatApi';

const socket = io("http://localhost:5000");

// ************************************************
// Reusable Component: Chat Modal
// ************************************************
const ChatModal = ({ onClose }) => {
    const { infoUser, setInfoUser } = useContext(UserContext);
    const [logged, setLogged] = useState(false);
    const [checked, setChecked] = useState(false);

    const [conversationId, setConversationId] = useState('');

    const [messages, setMessages] = useState([]);

    const [text, setText] = useState('');

    const [user, setUser] = useState({});

    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    // Cuộn xuống cuối tin nhắn khi có tin nhắn mới
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    //User Authentication
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await profileApi.profile();
                setUser({
                    id: response.user.id || 'UnknownId',
                    fullName: response.user.fullName || 'Unknown',
                    avatar: response.user.avatar
                });
                setLogged(true);
            } catch (err) {
                localStorage.removeItem('token');
                let userLocal = localStorage.getItem('user');

                if (!userLocal) {
                    const user = {
                        id: new Date().getTime().toString(),
                        fullName: 'Unknown',
                        avatar: ''
                    }
                    setUser(user);
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    const user = JSON.parse(userLocal);
                    setUser(user);
                }
            } finally {
                setChecked(true);
            }
        }
        getUser();
    }, []);

    // Set conversationId based on logged status
    useEffect(() => {
        if (!checked) return;

        if (logged) {
            if (infoUser.conversationId) {
                setConversationId(infoUser.conversationId);
            } else {
                setConversationId('');
            }
        } else {
            // For non-logged users, get conversationId from localStorage
            const localConvId = localStorage.getItem('conversationId');
            setConversationId(localConvId || '');
        }
    }, [checked, logged, infoUser.conversationId]);

    // Load messages when conversationId is set
    useEffect(() => {
        if (!checked || !conversationId) return;

        const getMessages = async () => {
            try {
                const response = await chatApi.getMessages(conversationId);
                setMessages(response.messages || []);
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
                // Clear invalid conversationId
                if (logged) {
                    setInfoUser(prev => ({ ...prev, conversationId: '' }));
                } else {
                    localStorage.removeItem('conversationId');
                }
                setMessages([]);
                setConversationId('');
            }
        }
        getMessages();
    }, [conversationId, checked]);

    // Kết nối socket
    useEffect(() => {
        if (!user.id) return;

        socket.emit('join', user.id);

        socket.on("receiveMessage", (message) => {
            setMessages(prev => ([...prev, message]));
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [user.id]);

    const postConversation = async () => {
        if (!user || !user.id) return null;
        try {
            const sender = user;
            const receiver = {
                id: 'mid24',
                fullName: 'FAKER',
                avatar: 'Azir'
            }
            const response = await chatApi.postConversation(sender, receiver);
            const newConvId = response.conversation._id;

            if (logged) {
                setInfoUser(prev => ({ ...prev, conversationId: newConvId }));
            } else {
                localStorage.setItem('conversationId', newConvId);
            }

            setConversationId(newConvId);
            return newConvId;
        } catch (err) {
            console.log(err.response?.data?.message || err.message);
            return null;
        }
    }

    const sendMessage = async () => {
        if (!user || !text.trim()) return;

        let currentConvId = conversationId;

        // Create conversation if it doesn't exist
        if (!currentConvId) {
            currentConvId = await postConversation();
            if (!currentConvId) return; // Failed to create conversation
        }
        const message = {
            conversationId: currentConvId,
            sender: user,
            receiver: {
                id: 'mid24',
                fullName: 'FAKER',
                avatar: 'Azir'
            },
            text: text,
            createdAt: new Date()
        };

        // Optimistically add message to UI
        setMessages(prev => [...prev, message]);
        setText("");

        // Gửi đến server qua socket
        socket.emit("sendMessage", message);

        try {
            await chatApi.postMessage(message);
        } catch (err) {
            console.log(err.response?.data?.message || err.message);
            // Remove the optimistically added message on error
            setMessages(prev => prev.filter(m => m !== message));

            // Clear invalid conversationId
            if (logged) {
                setInfoUser(prev => ({ ...prev, conversationId: '' }));
            } else {
                localStorage.removeItem('conversationId');
            }
            setConversationId('');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };
    return (
        <div className="fixed bottom-20 right-6 w-[500px] h-[450px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-300">

            {/* Header */}
            <div className={`p-4 rounded-t-xl flex justify-between items-center bg-brand hover:bg-brand-hover tex-white`}>
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
                {/* Message Area */}
                {messages?.length > 0 && messages?.map((chat, index) => (

                    <div key={index} className={`flex ${chat.sender?.id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={
                            `max-w-xs lg:max-w-md p-3 rounded-xl shadow-md  ${chat.sender?.id === user.id
                                ? 'bg-teal-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                            }`}
                        >
                            <p className="text-sm">{chat.text}</p>
                            <span className={`block mt-1 text-right text-xs ${chat.sender?.id === user.id ? 'text-teal-200' : 'text-gray-400'}`}>
                                {formatDate(chat.createdAt)} • {formatTime(chat.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}
                <div className="h-0.5"></div>

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
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        type="button"
                        className={`p-2 rounded-full transition bg-brand hover:bg-brand-hover tex-white disabled:bg-gray-400`}
                    >
                        <Send className="w-5 h-5 text-white" onClick={() => sendMessage()} />
                    </button>
                </div>
            </div>
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
                    bg-brand hover:bg-brand-hover tex-white
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

