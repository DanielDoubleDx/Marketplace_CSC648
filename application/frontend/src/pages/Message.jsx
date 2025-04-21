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
                <div className="flex-1 bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto space-y-4">
                    {/* Buyer Message */}
                    <div className="flex justify-start">
                        <div className="bg-gray-700 p-3 rounded-lg max-w-md">
                            Hi! I saw your listing for the iPad Pro. Is it still available?
                        </div>
                    </div>

                    {/* Seller Message */}
                    <div className="flex justify-end">
                        <div className="bg-green-600 p-3 rounded-lg max-w-md">
                            Hey! Yep, it's still available. It's in great condition.
                        </div>
                    </div>

                    {/* Buyer Message */}
                    <div className="flex justify-start">
                        <div className="bg-gray-700 p-3 rounded-lg max-w-md">
                            Awesome. Are you flexible on the price?
                        </div>
                    </div>

                    {/* Seller Message */}
                    <div className="flex justify-end">
                        <div className="bg-green-600 p-3 rounded-lg max-w-md">
                            I can knock off $30 if you're ready to buy it this week.
                        </div>
                    </div>

                    {/* Buyer Message */}
                    <div className="flex justify-start">
                        <div className="bg-gray-700 p-3 rounded-lg max-w-md">
                            Deal! Can we meet on campus tomorrow around noon?
                        </div>
                    </div>

                    {/* Seller Message */}
                    <div className="flex justify-end">
                        <div className="bg-green-600 p-3 rounded-lg max-w-md">
                            Sounds good! Let's meet at the student center at 12.
                        </div>
                    </div>
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
