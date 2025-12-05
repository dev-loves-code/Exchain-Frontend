import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiSend, FiMessageCircle, FiX } from "react-icons/fi";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm BMO! How can I help with Exchain today? 🎮" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  // Auto scroll to bottom
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
        question: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.reply || "Hmm, let me think about that..." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! Let's try that again.",
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
      {/* Floating Button with BMO Illustration */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-white p-2 rounded-full shadow-lg border-2 border-green-400 hover:shadow-xl transition-shadow hover:border-green-500"
          style={{ boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)' }}
        >
          <img 
            src="/BMO-illustration.jpg" 
            alt="BMO Assistant" 
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">B</div>';
            }}
          />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white shadow-xl rounded-xl border-2 border-green-300 flex flex-col">
          {/* Header with BMO Illustration */}
          <div className="bg-green-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="/BMO-illustration.jpg" 
                  alt="BMO" 
                  className="w-10 h-10 rounded-full border-2 border-white"
                  onError={(e) => {
                    // Fallback to simple div if image fails
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-10 h-10 bg-green-500 rounded-full border-2 border-white flex items-center justify-center font-bold text-white">B</div>';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">BMO Assistant</h3>
                <p className="text-green-100 text-xs">Exchain OS v1.0</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-green-700 p-1 rounded transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={scrollRef}
            className="p-4 h-64 overflow-y-auto space-y-3 bg-gradient-to-b from-green-50 to-white"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 max-w-xs text-sm rounded-lg ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-white border border-green-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">BMO</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
                <span className="text-sm ml-2">BMO is typing...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-green-200 bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onKeyDown={handleKey}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask BMO anything..."
                className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                style={{ color: "#000" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  loading || !input.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <FiSend size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;