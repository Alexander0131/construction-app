import { useState } from "react";

export default function Cookies() {
  const [showBanner, setShowBanner] = useState(() => !localStorage.getItem("cookieConsent"));

  // localStorage.clear()
  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-2 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">Cookie Preferences</h3>
          <p className="text-gray-600">
            We use cookies and local storage to improve your browsing
            experience, analyze site traffic, and enhance our services.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={rejectCookies}
            className="px-5 py-2 border rounded-lg cursor-pointer text-black"
          >
            Decline
          </button>

          <button
            onClick={acceptCookies}
            className="px-5 py-2 bg-slate-950 text-white rounded-lg cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}