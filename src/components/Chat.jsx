import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiSend, FiMessageCircle, FiX } from "react-icons/fi";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  // auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/chat/ask", {
  question: userMessage,  // ✅ Correct field name
});
  

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.reply || "No answer." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I couldn't process that.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-xl text-white hover:scale-110 transition"
        >
          <FiMessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-5 right-5 w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold text-lg">PayOne Assistant 💬</h3>
            <button
              onClick={() => setOpen(false)}
              className="hover:opacity-70 transition"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Chat body */}
          <div
            ref={scrollRef}
            className="p-4 h-80 overflow-y-auto space-y-3 bg-gray-50"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 max-w-xs text-sm shadow-md rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-700 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 text-sm italic">Bot is typing…</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white">

            <input
            style={{
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    color: "#000",          // 👈 MAKE TEXT BLACK
    background: "#fff",     // optional
  }}
              value={input}
              onKeyDown={handleKey}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:scale-105 shadow"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;