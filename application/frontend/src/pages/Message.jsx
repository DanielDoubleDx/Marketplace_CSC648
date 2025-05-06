import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { use } from 'react';

// Generate users
const users = Array.from({ length: 1 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
}));


// Generate messages
const allMessages = Array.from({ length: 2 }).map((_, i) => ({
  id: i + 1,
  text: i % 2 === 0 ? `Buyer message #${i + 1}` : `Seller message #${i + 1}`,
  sender: i % 2 === 0 ? 'buyer' : 'seller',
}));



function Message() {
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [message, setMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/messages'); 
      setAllMessages(response.data); 
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const sendMessage = async () => {
    //console.log('Sending message:', message);
    if(!message.trim()) return;
    const newMessage = {
      text: message,
      sender: 'buyer',
    };
    try {
      const response = await axios.post('http://localhost:3000/api/messages', newMessage);
      setAllMessages((prevMessages) => [...prevMessages, response.data]);
      setMessage('');
      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      //console.log('Fetching messages...');
      fetchMessages();
    }, 5000); // 5 seccond fetch
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  // Scroll position
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    setShowScrollButton(!isAtBottom);
  };

  // Scroll to the bottom of the message list
  const scrollToBottom = (behavior = 'smooth') => {
    const container = scrollRef.current;
    const bottom = bottomRef.current;
    if (container && bottom) {
      container.scrollTo({
        top: bottom.offsetTop,
        behavior,
      });
    }
  };

  return (
    <div className="container mx-auto h-[80vh] text-sm font-sans flex flex-col md:flex-row py-4">
      {/* User List */}
      <div className="hidden md:block w-1/4 border-r border-gray-700 overflow-y-auto bg-gray-900 text-white p-4 max-h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 flex flex-col bg-gray-800 text-white max-h-[80vh]">
        {/* Top Bar */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0 font-semibold text-lg">
          Contact Name
          {users.id}
        </div>

        {/* Messages Area */}
        <div className="relative flex-1 max-h-[60vh]">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto p-4 space-y-4 h-full"
          >
            {allMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`${
                    msg.sender === 'buyer' ? 'bg-gray-700' : 'bg-green-600'
                  } p-3 rounded-lg max-w-xs md:max-w-md break-words`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center transition"
              title="Go to latest"
            >
              ↓
            </button>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700 flex items-center gap-2 flex-shrink-0 bg-gray-800">
          <input
            type="text"
            className="flex-1 p-2 md:p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none border border-gray-600 focus:border-green-500"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
            onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
