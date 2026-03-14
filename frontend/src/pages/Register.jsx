import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../Footer/Footer';
import { useState } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollmentNo: '',
    department: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const body = {
        name: formData.name,
        email: formData.email,
        enrollmentNumber: formData.enrollmentNo,
        department: formData.department,
        password: formData.password
      };

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(data.msg || data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-grid min-h-screen flex flex-col justify-between pt-24">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl glass rounded-3xl overflow-hidden flex flex-col md:flex-row-reverse shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          {/* Right Panel (now visually on left or right depending on row-reverse) */}
          <div className="md:w-[45%] p-12 relative overflow-hidden bg-black/40 flex flex-col justify-center border-l border-white/5">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-600/10 to-purple-600/10" />
            
            <div className="relative z-10">
              <Link to="/" className="inline-block mb-12">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white">R</div>
                  RKUEvents
                </span>
              </Link>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Join the <br/> Network
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                Create an account to discover exclusive events, expand your skillset, and connect with peers across all departments.
              </p>
            </div>
          </div>

          {/* Left Form (now taking the rest of the space) */}
          <div className="md:w-[55%] p-10 md:p-12 bg-white/5 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-2">Create an Account</h3>
            <p className="text-gray-400 mb-8">Fill in your details to get started.</p>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="John Doe" required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Enrollment No.</label>
                  <input
                    type="text" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="123456789" required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="you@university.edu" required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Department</label>
                <select 
                  name="department" value={formData.department} onChange={handleChange} required
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
                >
                  <option value="" className="bg-gray-900 text-gray-400">Select Department</option>
                  <option value="SOE" className="bg-gray-900">School of Engineering (SoE)</option>
                  <option value="SOM" className="bg-gray-900">School of Management (SoM)</option>
                  <option value="SOS" className="bg-gray-900">School of Science (SoS)</option>
                  <option value="PHARMACY" className="bg-gray-900">School of Pharmacy</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="••••••••" required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : 'Create Account'}
              </motion.button>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`text-sm text-center mt-4 p-3 rounded-lg ${
                    message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {message}
                </motion.p>
              )}

              <p className="text-center text-gray-400 mt-6 !mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition">
                  Login here
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

export default Register;
