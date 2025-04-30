import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage('');

    // Proceed only if both email and password are filled
    if (email && password) {
      try {
        // Make API POST request
        const response = await fetch('http://13.52.231.140:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        // If login is successful
        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data);
          
          // After successful login, redirect to Home page
          navigate('/');

        } 
        // If user not found
        else if (response.status === 404) {
          setErrorMessage('⚠️ User not found. Please check your email or username.');
        } 
        // If password is incorrect
        else if (response.status === 401) {
          setErrorMessage('⚠️ Incorrect password. Please try again.');
        } 
        // Failure
        else {
          setErrorMessage('⚠️ Login failed. Please try again later.');
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrorMessage('⚠️ Network error. Please try again later.');
      }
    }
  };

  const inputClass = (value) =>
    `w-full px-4 py-2 rounded-lg bg-gray-700 border ${
      submitted && !value ? 'border-red-500' : 'border-gray-600'
    } text-white placeholder-gray-400 focus:outline-none focus:border-primary-500`;

  return (
    <div className="container mx-auto">
      <section className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Login</h2>

        {errorMessage && (
          <div className="bg-red-600 text-white text-sm p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Login form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email or Username field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(email)}
              placeholder="Enter your email or username"
            />
            {submitted && !email && (
              <p className="text-red-500 text-sm mt-1">⚠️ Enter your email</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass(password)}
                placeholder="Enter your password"
              />
              {/* Toggle show/hide password */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {/* Validation message for empty password */}
            {submitted && !password && (
              <p className="text-red-500 text-sm mt-1">⚠️ Minimum 6 characters required</p>
            )}
          </div>

          {/* Remember me and Forgot password link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="text-green-500 hover:text-green-600">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Sign up button */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Not a member?{' '}
          <Link to="/register" className="text-green-500 hover:text-green-600">
            Sign up now
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
