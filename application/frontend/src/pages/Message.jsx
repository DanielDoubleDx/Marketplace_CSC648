import React, { useRef, useEffect, useState } from 'react';

const allMessages = [
    // Need to fetch from an API later (hardcode right now)
    ...Array.from({ length: 200 }).map((_, i) => ({
        id: i + 1,
        text: i % 2 === 0
            ? `Buyer message #${i + 1}`
            : `Seller message #${i + 1}`,
        sender: i % 2 === 0 ? 'buyer' : 'seller',
    })),
];

const Message = () => {
    const bottomRef = useRef(null);
    const scrollRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        // Scroll to latest on load
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }, []);

    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
        setShowScrollButton(!isAtBottom);
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">

            {/* Sidebar */}
            <div className="w-1/4 p-6 border-r border-gray-700">
                <h2 className="text-2xl font-semibold mb-6">Messaging</h2>

                {/* User chat previews */}
                <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition">User 1</div>
                    <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition">User 2</div>
                    <div className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition">User 3</div>
                </div>
            </div>

            {/* Main chat area */}
            <div className="flex flex-col flex-1 p-6 relative">

                {/* Chatbox */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto space-y-4"
                >
                    {allMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`${msg.sender === 'buyer' ? 'bg-gray-700' : 'bg-green-600'} p-3 rounded-lg max-w-md`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef}></div>
                </div>

                {/* Floating scroll-to-bottom button */}
                {showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center transition"
                        title="Go to latest"
                    >
                        ↓
                    </button>
                )}

                {/* Input and Send */}
                <div className="flex items-center gap-4 mt-4">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;
