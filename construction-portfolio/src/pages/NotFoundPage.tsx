import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-yellow-500">
          404
        </h1>

        <p className="text-2xl mt-6">
          Page Not Found
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-yellow-500 px-8 py-4 rounded-xl text-black font-semibold hover:scale-105 transition"
        >
          Back Home
        </Link>
      </div>
    </section>
  );
}