import { Link } from "react-router-dom";
import Cookies from "./Cookies";
import { FaFacebookF, FaLinkedin, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

const FOOTER_LINKS = [
  { tag: <FaFacebookF/>,to:"/", label: "facebook" },
  { tag: <FaXTwitter/>, to:"/", label: "About" },
  { tag: <FaWhatsapp/>, to:"/", label: "Projects" },
  { tag: <FaLinkedin/>, to:"/", label: "Services" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-10 px-4 sm:px-6">
      <Cookies />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500">DremCons.</h1>
          <p className="text-slate-400 mt-2">Building quality infrastructure for the future.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-slate-300">
          {FOOTER_LINKS.map(({tag, to, label }) => (
            <Link key={label} to={to} className="hover:text-white transition">
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
