import React from 'react';

const Message = () => {
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
            <div className="flex flex-col flex-1 p-6">

                {/* Chat display area */}
                <div className="flex-1 bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto">
                </div>

                {/* Input and Send */}
                <div className="flex items-center gap-4">
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
