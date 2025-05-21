import React, { useRef, useEffect, useState } from 'react';

/*
// Generate users
const users = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  name: `User ${i}`,
}));
*/




function Message() { 
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [message, setMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //test user id 1
  //const [userId, setUserId] = useState(1);

  
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [userId, setUserId] = useState(storedUser?.id || null);
  //default chat
  const [selectedUser, setSelectedUser] = useState(null); 

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //const response = await axios.get('http://13.91.27.12:3001/api/user');
        //setUsers(response.data);
        
        const response = await fetch('http://13.91.27.12:3001/api/user');
        const data = await response.json();
        setUsers(data);

        
        if(response.data.length > 0) {
          setSelectedUser(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);


  

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      //const response = await axios.get(`http://13.91.27.12:3001/api/messaging/${userId}`);
      //const rawData = response.data;
      const response = await fetch(`http://13.91.27.12:3001/api/messaging/${userId}`);
      const rawData = await response.json();


      const normalizedMessages = [];
      rawData.forEach((entry)=>{
        const senderMessages = entry.sender_text?.split('|') || [];
        const receiverMessages = entry.receiver_text?.split('|') || []
        senderMessages.forEach((text, index) => {
          if (text.trim()) {
            normalizedMessages.push({
              id: `s-${entry.sender}-${entry.receiver}-${index}`,
              sender: entry.sender,
              receiver: entry.receiver,
              text: text.trim(),
            });
          }
        });
        receiverMessages.forEach((text, index) => {
          if (text.trim()) {
            normalizedMessages.push({
              id: `r-${entry.receiver}-${entry.sender}-${index}`,
              sender: entry.receiver,
              receiver: entry.sender,
              text: text.trim(),
            });
          }
        });
      });
      setAllMessages(normalizedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  const sendMessage = async () => {
    //console.log('Sending message:', message);
    if (!message.trim()) return;
    const newMessage = {
      text: message,
      sender: userId,
      receiver: selectedUser.uuid,
    };
    try {
      //const response = await axios.post(`http://13.91.27.12:3001/api/messaging/${userId}`, newMessage);
      //setAllMessages((prevMessages) => [...prevMessages, response.data]);

      const response = await fetch(`http://13.91.27.12:3001/api/messaging/${userId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });
      const data = await response.json();
      setAllMessages((prevMessages) => [...prevMessages, data]);

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
    }, 5000); // fetch every 5 seconds
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

  const handleHamburgerMouseEnter = () => {
    if (!clicked) setIsMenuOpen(true);
  };
  const handleHamburgerMouseLeave = () => {
    if (!clicked) setIsMenuOpen(false);
  };
  const handleHamburgerClick = () => {
    setIsMenuOpen(true);
    setClicked(true);
  };
  const handleMenuMouseLeave = () => {
    if(!clicked) setIsMenuOpen(false);
    setClicked(false);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    setClicked(false);
  };
  const setLocation1 = () => {
    setMessage('Lets meet at the Caesar Chavez Student Center https://www.google.com/maps/place/Cesar+Chavez+Student+Center/@37.7218478,-122.4792209,18.71z/data=!4m14!1m7!3m6!1s0x808f7db005c0e281:0xa57a7c9f946a45d3!2sSan+Francisco+State+University!8m2!3d37.7241492!4d-122.4799405!16zL20vMDEzODA3!3m5!1s0x808f7d455f68362f:0x60449417c15ebf0!8m2!3d37.7225174!4d-122.4787258!16s%2Fg%2F11h4chkxjd?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D');
    closeMenu();
  };
  const setLocation2 = () => {
    setMessage('Lets meet at the SFSU Library https://www.google.com/maps/place/J.+Paul+Leonard+Library/@37.7215794,-122.4789369,19.29z/data=!3m1!5s0x808f7db19c82147d:0x9522980b53575235!4m14!1m7!3m6!1s0x808f7db005c0e281:0xa57a7c9f946a45d3!2sSan+Francisco+State+University!8m2!3d37.7241492!4d-122.4799405!16zL20vMDEzODA3!3m5!1s0x808f7db19cf793a3:0x82b61bd57041d4c1!8m2!3d37.7213653!4d-122.4781364!16s%2Fg%2F1hdzvq0kl?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D');
    closeMenu();
  };
  const setLocation3 = () => {
    setMessage(`Lets meet at Cafe Rosso https://www.google.com/maps/place/Cafe+Rosso/@37.7222469,-122.4797513,19z/data=!4m14!1m7!3m6!1s0x808f7db005c0e281:0xa57a7c9f946a45d3!2sSan+Francisco+State+University!8m2!3d37.7241492!4d-122.4799405!16zL20vMDEzODA3!3m5!1s0x808f7db02f2f1793:0xe5d876e1cf3b2686!8m2!3d37.7228539!4d-122.4802905!16s%2Fg%2F1ptvs11h2?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D`)
    closeMenu();
  };
  const setLocation4 = () => {
    setMessage(`Lets meet at the Mashouf Wellness Center https://www.google.com/maps/place/Mashouf+Wellness+Center/@37.7219295,-122.482562,18.42z/data=!4m14!1m7!3m6!1s0x808f7db005c0e281:0xa57a7c9f946a45d3!2sSan+Francisco+State+University!8m2!3d37.7241492!4d-122.4799405!16zL20vMDEzODA3!3m5!1s0x808f7daf7158d19b:0x86a26e2b053dbeb7!8m2!3d37.7227874!4d-122.4841667!16s%2Fg%2F11g9vmqkb5?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D`)
    closeMenu();
  };
  const setLocation5 = () => {
    setMessage(`lets meet at the University Police Department https://www.google.com/maps/place/University+Police+Department/@37.7256263,-122.482499,18.71z/data=!4m14!1m7!3m6!1s0x808f7db005c0e281:0xa57a7c9f946a45d3!2sSan+Francisco+State+University!8m2!3d37.7241492!4d-122.4799405!16zL20vMDEzODA3!3m5!1s0x808f7da53cdba9f9:0x6dc874e2aa4aa558!8m2!3d37.7259236!4d-122.4816663!16s%2Fg%2F11xhnpt9z?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D`)
    closeMenu();
  };
  const filteredMessages = selectedUser
  ? allMessages.filter(
      (msg) =>
        (msg.sender === userId && msg.receiver === selectedUser.uuid) ||
        (msg.sender === selectedUser.uuid && msg.receiver === userId)
    )
  : [];

  return (
    <div className="container mx-auto h-[80vh] text-sm font-sans flex flex-col md:flex-row py-4">
      {/* User List */}
      <div className="hidden md:block w-1/4 border-r border-gray-700 overflow-y-auto bg-gray-900 text-white p-4 max-h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4">People</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
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
          Contact Name: {selectedUser ? selectedUser.name : 'Loading...'}
        </div>

        {/* Messages Area */}
        <div className="relative flex-1 max-h-[60vh]">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto p-4 space-y-4 h-full"
          >
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === userId ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`${
                    msg.sender === userId ? 'bg-gray-700' : 'bg-green-600'
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
          <button
            className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
            onClick={sendMessage}
          >
            Send
          </button>
          <div
            className="relative"
            onMouseLeave={handleMenuMouseLeave}
          >
            <button
              onMouseEnter={handleHamburgerMouseEnter}
              onClick={handleHamburgerClick}
              className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
              aria-label="Open menu"
            >
              ≡
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 top-full mt-2 bg-gray-800 rounded shadow-lg z-50 p-4 w-32 space-y-3">
                <div className="text-white" onClick={setLocation1}>Caesar Chavez Center</div>
                <div className="text-white" onClick={setLocation2}>SFSU Library</div>
                <div className="text-white" onClick={setLocation3}>Cafe Rosso</div>
                <div className="text-white" onClick={setLocation4}>Mashouf Wellness Center</div>
                <div className="text-white" onClick={setLocation5}>University Police Department</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Message;
