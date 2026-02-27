import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiMail, 
  FiLock, 
  FiArrowRight, 
  FiBriefcase, 
  FiUsers,
  FiFileText,
  FiHome,
  FiShield,
  FiAward
} from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMzBtLTI4IDBhMjggMjggMCAxIDEgNTYgMCAyOCAyOCAwIDEgMSAtNTYgMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-16">
          <div>
            {/* Logo Area */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-xl shadow-2xl">
                <FiShield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">TheAdvocate</h1>
                <p className="text-blue-200 text-sm mt-1">Navigate Justice with Ease</p>
              </div>
            </div>
            
            {/* ADDED: Bigger title below logo in blue section */}
            <div className="mt-4 ml-1">
              <p className="text-blue-300 text-base uppercase tracking-wider font-semibold">
                Attorney Case Management Dashboard
              </p>
            </div>
          </div>

          {/* Center Quote */}
          <div className="space-y-6">
            <div className="border-l-4 border-blue-400 pl-6">
              <p className="text-2xl font-light text-white leading-relaxed">
                "Justice is not just about winning,<br />it's about navigating the path with precision."
              </p>
              
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <FiBriefcase className="h-5 w-5 text-blue-400 mb-2" />
                <h3 className="text-white font-medium">Case Management</h3>
                <p className="text-blue-200 text-xs mt-1">Organize your practice</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <FiAward className="h-5 w-5 text-blue-400 mb-2" />
                <h3 className="text-white font-medium">Legal Analytics</h3>
                <p className="text-blue-200 text-xs mt-1">Data-driven insights</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div>
            <p className="text-blue-300 text-sm">
              © 2026 TheAdvocate. All rights reserved.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center justify-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-xl">
                <FiShield className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">TheAdvocate</h1>
                <p className="text-gray-500 text-sm">Navigate Justice with Ease</p>
              </div>
            </div>
            {/* ADDED: Bigger mobile version title */}
            <p className="text-base text-gray-400 mt-2 uppercase tracking-wider">
              Attorney Case Management Dashboard
            </p>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to access your legal dashboard
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="advocate@lawfirm.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>



            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
                  <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;