import { Link, useLocation } from "react-router-dom";
import DarkMode from "./DarkMode";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    // { path: "/canvas", label: "Canvas" },
  ];
    
  return (
    <nav className="w-full overflow-x-hidden p-4 px-6 bg-gray-50 dark:bg-[#0B1118] shadow-sm border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      {/* Logo / Title */}
      <div className="text-2xl font-bold cursor-pointer">
        <Link
          to="/"
          className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          SketchSync
        </Link>
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex gap-6 font-medium text-gray-700 dark:text-gray-300">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`hover:text-purple-500 dark:hover:text-purple-400 transition ${
                location.pathname === link.path
                  ? "text-purple-600 dark:text-purple-400 font-semibold"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Dark Mode Toggle */}
      <div>
        <DarkMode />
      </div>
    </nav>
  );
};

export default Navbar;
