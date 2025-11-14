import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token & user in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // ✅ user info saved here

        setMessage('Login successful! Redirecting...');

        // Redirect based on role
        if (data.user.role === 'student') {
          navigate('/');
        } else if (data.user.role === 'department-admin') {
          navigate('/department-admin');
        } else if (data.user.role === 'superadmin') {
          navigate('/super-admin');
        }
      } else {
        setMessage(data.msg || data.message || 'Login failed.');
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left Section */}
        <div className="md:w-1/2 bg-blue-600 text-white flex items-center justify-center p-10">
          <div>
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="mt-2 text-sm text-blue-100">Login to continue managing your events.</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Login</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {message && (
              <p
                className={`text-sm text-center mt-2 ${
                  message.includes('success') ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {message}
              </p>
            )}

            <p className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
