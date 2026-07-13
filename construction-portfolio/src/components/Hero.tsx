import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import herobg from "../assets/herobg.jpg";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <img src={herobg} alt="Construction site" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight"
        >
          Building The Future
        </motion.h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg max-w-2xl text-gray-200">
          Professional construction and engineering solutions for modern infrastructure.
        </p>

        <Link to="/projects">
          <button className="mt-6 sm:mt-8 bg-yellow-500 hover:bg-yellow-600 transition px-6 py-3 rounded-lg font-semibold">
            View Projects
          </button>
        </Link>
      </div>
    </section>
  );
}
