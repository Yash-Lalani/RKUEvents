import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
  ];

  if (
    location.pathname.startsWith("/super-admin") ||
    location.pathname.startsWith("/department-admin") ||
    location.pathname.startsWith("/DepartmentAdmin")
  ) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white"
          >
            R
          </motion.div>
          RKUEvents
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 text-gray-300 font-medium">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`relative group transition duration-300 ${
                    location.pathname === item.path ? "text-white" : "hover:text-white"
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  )}
                  {location.pathname !== item.path && (
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  )}
                </Link>
              </li>
            ))}

            {isLoggedIn && (
              <li>
                <Link
                  to="/profile"
                  className={`relative group transition duration-300 ${
                    location.pathname === "/profile" ? "text-white" : "hover:text-white"
                  }`}
                >
                  Profile
                  {location.pathname === "/profile" && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  )}
                  {location.pathname !== "/profile" && (
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  )}
                </Link>
              </li>
            )}
          </ul>

          <div className="flex gap-4">
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-5 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 hover:border-red-500 transition bg-black/20"
              >
                Logout
              </motion.button>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-5 py-2 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/10 hover:border-blue-500 transition bg-black/20"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transition shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-6 pt-2 bg-black/90 backdrop-blur-xl border-t border-white/10"
          >
            <ul className="flex flex-col gap-4 text-gray-300 font-medium">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="block py-2 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {isLoggedIn && (
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
              )}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center px-4 py-3 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/10 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
