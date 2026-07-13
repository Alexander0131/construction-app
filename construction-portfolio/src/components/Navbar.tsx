import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import NavLinks from "./NavLinks";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <nav className="bg-slate-950 text-white px-4 sm:px-6 py-4 sm:py-5 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500">DremCons.</h1>

        <div className="hidden md:flex gap-8 text-lg font-medium">
          <NavLinks />
        </div>

        <div className="flex md:hidden">
          <FaBars className="cursor-pointer size-6" onClick={() => setOpenMenu(true)} />

          <div
            onClick={() => setOpenMenu(false)}
            className={`fixed inset-0 bg-black backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
              openMenu ? "opacity-70 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          />

          <div
            className={`fixed bg-slate-950 w-[80%] max-w-xs top-0 bottom-0 right-0 shadow-2xl transition-transform duration-500 ease-in-out transform ${
              openMenu ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-16 flex items-center justify-end px-4">
              <FaTimes
                onClick={() => setOpenMenu(false)}
                className="size-6 cursor-pointer border-amber-200 border-2 rounded-full p-0.5 text-amber-200 hover:text-white transition-colors"
              />
            </div>
            <div className="flex flex-col gap-4 p-4">
              <NavLinks onNavigate={() => setOpenMenu(false)} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
