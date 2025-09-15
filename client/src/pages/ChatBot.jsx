import { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are an expert travel assistant specialized in tourism in Pakistan. Help users with destinations, hotels, food, culture, and more.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { messages: newMessages });
      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.content },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Sorry, something went wrong." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 pt-32 pb-10 flex justify-center">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 text-center">
          🇵🇰 Pakistan Travel Chatbot
        </h2>

        <div className="h-[250px] overflow-y-auto border rounded-md p-3 bg-gray-50 mb-4 space-y-3 text-sm">
          {messages
            .filter((msg) => msg.role !== "system")
            .map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-md text-white ${
                    msg.role === "user" ? "bg-blue-600" : "bg-green-600"
                  } max-w-[70%]`}
                >
                  <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
                  {msg.content}
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something about traveling in Pakistan..."
            className="flex-grow px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 text-sm"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
