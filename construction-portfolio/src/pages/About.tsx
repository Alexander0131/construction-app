import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaHardHat, FaBuilding, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiPageAddCount } from "../service/api";

const STATS = [
  { icon: FaBuilding, value: "250+", label: "Projects" },
  { icon: FaUsers, value: "120+", label: "Workers" },
  { icon: FaHardHat, value: "15+", label: "Years" },
];

export default function About() {
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    apiPageAddCount("about");
  }, []);

  return (
    <>
      <Navbar />

      <section className="bg-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-yellow-500 font-semibold uppercase tracking-widest">About Us</p>

            <h1 className="text-3xl sm:text-5xl font-bold mt-4 leading-tight">
              Building Modern Infrastructure With Excellence
            </h1>

            <p className="text-slate-300 mt-6 leading-8">
              We are a trusted construction company delivering high-quality residential,
              commercial, and industrial projects with modern engineering solutions and
              world-class standards.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-10">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-slate-800 p-4 sm:p-6 rounded-2xl text-center">
                  <Icon className="text-3xl sm:text-4xl text-yellow-500 mx-auto" />
                  <h3 className="mt-3 sm:mt-4 text-xl sm:text-3xl font-bold">{value}</h3>
                  <p className="text-slate-400 text-xs sm:text-base">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd"
              alt="Construction site"
              className="rounded-3xl shadow-2xl h-[300px] sm:h-[450px] lg:h-[600px] w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
