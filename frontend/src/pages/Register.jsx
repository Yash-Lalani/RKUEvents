import React, { useState } from 'react';

const Register = () => {
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
      enrollmentNumber: formData.enrollmentNo, // must match backend
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
      setMessage('Registration successful! You can now login.');
      setFormData({ name: '', email: '', enrollmentNo: '', department: '', password: '' });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-4">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        <div className="md:w-1/2 bg-blue-600 text-white flex items-center justify-center p-10">
          <div>
            <h2 className="text-3xl font-bold">Join RKU Events</h2>
            <p className="mt-2 text-sm text-blue-100">Create your account and never miss an update!</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Create an Account</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Form fields remain the same */}
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Enrollment Number</label>
              <input type="text" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123456789" />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                <option value="SOE">School of Engineering (SoE)</option>
                <option value="SOM">School of Management (SoM)</option>
                <option value="SOS">School of Science (SoS)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>

            {message && <p className="text-sm text-center text-red-500 mt-2">{message}</p>}

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
