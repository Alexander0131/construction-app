import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/posts", label: "Posts" },
  { to: "/contact", label: "Contact" },
];

const BASE_STYLE =
  "h-10 hover:bg-yellow-500 flex rounded pl-3 w-[80%] items-center hover:text-white transition duration-300 uppercase md:h-auto md:w-auto md:pl-0 md:bg-transparent";
const ACTIVE_STYLE = "text-yellow-500";

export default function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={onNavigate}
          className={({ isActive }) => `${BASE_STYLE} ${isActive ? ACTIVE_STYLE : ""}`}
        >
          {label}
        </NavLink>
      ))}
    </>
  );
}
