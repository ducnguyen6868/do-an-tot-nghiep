import { useState } from 'react';
import {
    MessageSquare, Send, Search, X,
} from 'lucide-react';

const Message = ({ userId }) => {
    // Dữ liệu giả định cho Chat
    const [activeChat, setActiveChat] = useState(null);
    const mockContacts = [
        { id: 'u1', name: 'John Doe (Online)', status: 'online', lastMessage: 'Received new order #1024', avatar: 'https://placehold.co/40x40/0d9488/ffffff?text=JD' },
        { id: 'u2', name: 'Jane Smith', status: 'offline', lastMessage: 'Please check the product listing.', avatar: 'https://placehold.co/40x40/06b6d4/ffffff?text=JS' },
        { id: 'u3', name: 'Timepiece Support', status: 'online', lastMessage: 'Your issue has been resolved.', avatar: 'https://placehold.co/40x40/f97316/ffffff?text=TS' },
        { id: 'u4', name: 'Michael Lee', status: 'offline', lastMessage: 'When will the new watches arrive?', avatar: 'https://placehold.co/40x40/8b5cf6/ffffff?text=ML' },
        { id: 'u5', name: 'Admin Bot', status: 'online', lastMessage: 'Welcome to the chat system.', avatar: 'https://placehold.co/40x40/10b981/ffffff?text=AB' },
    ];

    const mockMessages = activeChat ? [
        { id: 1, text: "Hello John, I see your order #1024. How can I assist you today?", sender: 'system' },
        { id: 2, text: "Hi! Yes, I wanted to confirm the delivery timeline for that specific watch model.", sender: 'user' },
        { id: 3, text: "Certainly. I am checking the current logistics status now. One moment.", sender: 'system' },
        { id: 4, text: "Got it, thanks!", sender: 'user' },
    ] : [];

    const BRAND_COLOR = 'bg-teal-600';
    const BRAND_HOVER = 'hover:bg-teal-700';

    return (
        // Điều chỉnh chiều cao để lấp đầy không gian main content
        <div className="h-[calc(100vh-6rem)] flex rounded-xl overflow-hidden shadow-2xl bg-white border border-gray-200">
            {/* 1. Contact List Sidebar (Cột Trái) - Thiết kế cố định 320px cho PC */}
            <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50 flex-shrink-0">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Chats ({mockContacts.length})</h2>
                    <div className="mt-3 relative">
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                {/* Danh sách Liên hệ */}
                <div className="flex-1 overflow-y-auto">
                    {mockContacts.map(contact => (
                        <div
                            key={contact.id}
                            className={`flex items-center p-4 cursor-pointer border-b border-gray-100 transition-colors 
                                ${activeChat?.id === contact.id ? 'bg-teal-50 border-l-4 border-teal-600' : 'hover:bg-gray-100'}
                            `}
                            onClick={() => setActiveChat(contact)}
                        >
                            <div className="relative">
                                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                                <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white 
                                    ${contact.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}
                                ></span>
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate text-gray-800">{contact.name}</p>
                                <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Chat Window (Cột Phải) - Chiếm phần không gian còn lại */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                            <div className="flex items-center">
                                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{activeChat.name}</h3>
                                    <p className={`text-xs ${activeChat.status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
                                        {activeChat.status === 'online' ? 'Online' : 'Last seen yesterday'}
                                    </p>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-100">
                            {mockMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-md 
                                        ${msg.sender === 'user'
                                            ? 'bg-teal-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                                        }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        <span className={`block mt-1 text-right text-xs ${msg.sender === 'user' ? 'text-teal-200' : 'text-gray-400'}`}>
                                            {new Date().toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="h-0.5"></div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-200 bg-white flex items-center space-x-3">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-teal-500 focus:border-teal-500 transition"
                            />
                            <button className={`p-3 rounded-full text-white ${BRAND_COLOR} ${BRAND_HOVER} transition-colors shadow-lg shadow-teal-500/50`}>
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 text-center">
                        <MessageSquare className="w-16 h-16 text-teal-400 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700">Select a Chat</h2>
                        <p className="text-gray-500 mt-2">Choose a contact from the sidebar to start a conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ************************************************
// 3. Main Component: App (Dashboard Layout)
// ************************************************
export default function ChatManagement() {

    const userId = "admin_user_2025";
    
    return (
        <Message userId={userId} />
    )
};

