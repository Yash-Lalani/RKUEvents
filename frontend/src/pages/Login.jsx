import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../Footer/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Login successful! Redirecting...');
        
        setTimeout(() => {
          if (data.user.role === 'student') navigate('/');
          else if (data.user.role === 'department-admin') navigate('/department-admin');
          else if (data.user.role === 'superadmin') navigate('/super-admin');
        }, 1000);
      } else {
        setMessage(data.msg || data.message || 'Login failed.');
        setLoading(false);
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-grid min-h-screen flex flex-col justify-between pt-24">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          {/* Left Panel */}
          <div className="md:w-1/2 p-12 relative overflow-hidden bg-black/40 flex flex-col justify-center border-r border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
            
            <div className="relative z-10">
              <Link to="/" className="inline-block mb-12">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white">R</div>
                  RKUEvents
                </span>
              </Link>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Welcome <br/> Back!
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                Sign in to manage your events, register for upcoming programs, and connect with the university community.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:w-1/2 p-10 md:p-14 bg-white/5 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-2">Login to Your Account</h3>
            <p className="text-gray-400 mb-8">Enter your details to proceed.</p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="name@university.edu"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2 flex justify-between">
                  <span>Password</span>
                  <a href="#" className="text-blue-400 hover:text-blue-300 text-xs transition">Forgot password?</a>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : 'Sign In'}
              </motion.button>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`text-sm text-center mt-4 p-3 rounded-lg flex items-center justify-center gap-2 ${
                    message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {message}
                </motion.p>
              )}

              <p className="text-center text-gray-400 mt-8">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition">
                  Create one now
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
