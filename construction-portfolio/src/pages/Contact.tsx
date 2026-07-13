import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Notification from "../admin/components/Notification";
import globe1 from "../assets/globe1.png";
import { apiPageAddCount, getConfig, sendMessageToApi } from "../service/api";
import type { NotificationProps, configType, contactUser } from "../service/types";

const VALUE_PROPS = [
  {
    title: "Excellence in Construction and Value",
    body: "We are committed to delivering exceptional construction solutions that combine superior craftsmanship, durable materials, and competitive pricing. Every project is executed with a strong focus on quality, safety, and long-term value.",
  },
  {
    title: "End-to-End Construction Solutions",
    body: "From initial planning and architectural design to project management and final handover, we provide comprehensive construction services tailored to each client's needs.",
  },
  {
    title: "Building for the Future",
    body: "Whether it's residential, commercial, industrial, or renovation projects, we take pride in creating structures that stand the test of time.",
  },
];

const DEFAULT_CONTACT = {
  address: "Spintex, Ghana",
  phone: "+233 508 393 631",
  email: "info@dremcons.com",
};

const EMPTY_USER_DETAIL: contactUser = { yourName: "", yourEmail: "", yourSubject: "", yourMessage: "" };

export default function Contact() {
  const [userDetail, setUserDetail] = useState<contactUser>(EMPTY_USER_DETAIL);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [contactData, setContactData] = useState<configType | null>(null);
  const [loading, setLoading] = useState(false);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    async function loadPage() {
      apiPageAddCount("contact");
      try {
        const res = await getConfig("contact-info");
        setContactData(res.data);
      } catch (error) {
        console.error("Failed to load contact info:", error);
      }
    }

    loadPage();
  }, []);

  function updateField<K extends keyof contactUser>(field: K, value: contactUser[K]) {
    setUserDetail((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSend() {
    if (loading) return;

    const isComplete = Object.values(userDetail).every((value) => value.trim() !== "");
    if (!isComplete) {
      setNotification({ message: "Please fill in every field", type: "error", duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      const res = await sendMessageToApi(userDetail);
      setNotification({ message: res.message, type: res.success ? "success" : "error", duration: 3000 });
      if (res.success) setUserDetail(EMPTY_USER_DETAIL);
    } catch (error) {
      console.error("Failed to send message:", error);
      setNotification({ message: "Something went wrong, please try again", type: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <section className="bg-white py-10 px-4 sm:px-7">
        <div className="grid md:grid-cols-3 gap-6 sm:gap-10">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="bg-slate-100 p-4 sm:p-2 rounded-2xl shadow-xl">
              <h2 className="text-center text-xl sm:text-2xl font-bold mt-4 text-slate-900">{prop.title}</h2>
              <p className="text-slate-600 leading-6 text-center mt-2">{prop.body}</p>
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl grid lg:grid-cols-2 mt-10 mx-auto gap-10 sm:gap-16">
          <img src={globe1} className="absolute top-30 opacity-[0.2] hidden sm:block" alt="" />

          <div className="relative">
            <p className="text-yellow-500 uppercase font-semibold">Contact Us</p>

            <h1 className="text-3xl sm:text-5xl font-bold mt-4 text-slate-900">
              Let's Build Something Great Together
            </h1>

            <p className="mt-6 text-slate-600 leading-8">
              Contact us today for consultations, quotations, and project discussions.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <h3 className="font-bold text-xl">Address</h3>
                <p className="text-slate-600">{contactData?.message || DEFAULT_CONTACT.address}</p>
              </div>
              <div>
                <h3 className="font-bold text-xl">Phone</h3>
                <p className="text-slate-600">
                  {contactData?.children?.length
                    ? contactData.children.join(", ")
                    : DEFAULT_CONTACT.phone}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl">Email</h3>
                <p className="text-slate-600">{contactData?.description || DEFAULT_CONTACT.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-6 sm:p-10 rounded-3xl shadow-xl">
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                value={userDetail.yourName}
                onChange={(e) => updateField("yourName", e.target.value)}
                className="w-full p-4 rounded-xl border outline-none focus:border-yellow-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={userDetail.yourEmail}
                onChange={(e) => updateField("yourEmail", e.target.value)}
                className="w-full p-4 rounded-xl border outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Subject"
                value={userDetail.yourSubject}
                onChange={(e) => updateField("yourSubject", e.target.value)}
                className="w-full p-4 rounded-xl border outline-none focus:border-yellow-500"
              />
              <textarea
                placeholder="Message"
                rows={6}
                value={userDetail.yourMessage}
                onChange={(e) => updateField("yourMessage", e.target.value)}
                className="w-full p-4 rounded-xl border outline-none focus:border-yellow-500"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 cursor-pointer transition px-8 py-4 rounded-xl text-white font-semibold w-full"
              >
                {loading ? (
                  <span className="flex w-full justify-center">
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}
