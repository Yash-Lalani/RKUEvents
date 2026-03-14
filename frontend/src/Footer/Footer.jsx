
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-black/60 backdrop-blur-xl z-20 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-base">R</div>
                RKUEvents
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-md">
              The premier platform for university events. Discover opportunities, connect with peers, and elevate your academic journey through curated experiences.
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-blue-400 transition-colors">All Events</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-blue-400 transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="text-white font-semibold mb-6">Connect</h3>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-gray-400 hover:text-purple-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-purple-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} RKUEvents. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
