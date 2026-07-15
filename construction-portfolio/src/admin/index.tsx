import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { FaThList } from "react-icons/fa";
import {
  FaAngleLeft,
  FaAngleRight,
  FaHome,
  FaPlus,
  FaEnvelope,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const NAV_ITEMS = [
  { to: "/", icon: FaHome, label: "Home" },
  { to: "/admin/company", icon: MdDashboard, label: "Dashboard", end: true },
  { to: "/admin/company/add", icon: FaPlus, label: "Add" },
  { to: "/admin/company/list", icon: FaThList, label: "Manage" },
];

const BOTTOM_NAV_ITEMS = [
  { to: "/admin/company/messages", icon: FaEnvelope, label: "Messages" },
];

export default function AdminHomePage() {
  const { pathname } = useLocation();
  const [openBar, setOpenBar] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setOpenBar(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = (path: string, exact = false) => {
    const active = exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
    return `flex items-center gap-2 hover:bg-amber-500 p-1.5 rounded transition-colors duration-200 ${
      active ? "bg-amber-500 text-white" : "text-black"
    }`;
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex-none flex justify-between items-center bg-slate-900 px-3 sm:px-4 py-2">
        <span className="text-2xl sm:text-3xl font-bold text-yellow-500">DremCons.</span>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-white">Admin</span>
          <UserButton afterSignOutUrl="/admin/sign-in" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`relative z-10 flex flex-col justify-between h-full flex-none border-r border-r-yellow-500 shadow-2xl p-2 transition-all duration-300 ${
            openBar ? "w-40" : "w-12"
          }`}
        >
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <Link key={to} className={linkStyle(to, end)} to={to}>
                <Icon className="size-6 shrink-0" />
                {openBar && <span className="truncate">{label}</span>}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {BOTTOM_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <Link key={to} className={linkStyle(to)} to={to}>
                <Icon className="size-6 shrink-0" />
                {openBar && <span className="truncate">{label}</span>}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpenBar(!openBar)}
            className="absolute bottom-1/2 translate-y-1/2 right-[-15px]"
            aria-label={openBar ? "Collapse sidebar" : "Expand sidebar"}
          >
            {openBar ? (
              <FaAngleLeft className="text-white bg-slate-900 h-7 w-7 rounded-full p-1" />
            ) : (
              <FaAngleRight className="text-white bg-slate-900 h-7 w-7 rounded-full p-1" />
            )}
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
