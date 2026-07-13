import { useEffect, useState } from "react";
import { getMessages, type ContactMessage } from "../../service/api";
import Loader from "../components/Loader";

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .catch((error) => console.error("Failed to load messages:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message._id} className="rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg">{message.yourSubject}</h3>
                <span className="text-xs sm:text-sm text-gray-400">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {message.yourName} &lt;{message.yourEmail}&gt;
              </p>
              <p className="text-gray-800 whitespace-pre-wrap">{message.yourMessage}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}