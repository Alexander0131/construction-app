import { useEffect, useState } from "react";
import type { NotificationProps } from "../../service/types";

export default function Notification({ message, type = "success", duration = 4000, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-15 right-2 z-50 max-w-[90vw] sm:max-w-sm px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
