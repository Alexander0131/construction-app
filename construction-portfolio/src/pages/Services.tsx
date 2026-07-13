import { useEffect, useRef } from "react";
import { FaBuilding, FaPaintRoller, FaRoad, FaTools } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiPageAddCount } from "../service/api";

const SERVICES = [
  { icon: <FaBuilding />, title: "Commercial Construction", desc: "Professional large-scale commercial building solutions." },
  { icon: <FaPaintRoller />, title: "Renovation", desc: "Modern renovation and remodeling services." },
  { icon: <FaRoad />, title: "Road Construction", desc: "Reliable road and civil engineering services." },
  { icon: <FaTools />, title: "Maintenance", desc: "Building maintenance and repair services." },
];

export default function Services() {
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    apiPageAddCount("services");
  }, []);

  return (
    <>
      <Navbar />

      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-yellow-500 font-semibold uppercase">Our Services</p>
            <h1 className="text-3xl sm:text-5xl font-bold mt-4 text-slate-900">Quality Construction Services</h1>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-16">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="bg-slate-100 rounded-3xl p-6 sm:p-8 hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-lg"
              >
                <div className="text-4xl sm:text-5xl">{service.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold mt-5 sm:mt-6">{service.title}</h3>
                <p className="mt-3 sm:mt-4 leading-7">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
