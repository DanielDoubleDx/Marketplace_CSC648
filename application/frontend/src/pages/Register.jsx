import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Enter your email or mobile phone number';
    } else if (!formData.email.includes('@')) {
      newErrors.email = "Please include an '@' in the email address.";
    } else if (!formData.email.endsWith('@sfsu.edu')) {
      newErrors.email = 'Please use a valid SFSU email address ending with @sfsu.edu.';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Enter your username';
    }

    if (!formData.password) {
      newErrors.password = 'Minimum 6 characters required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    }

    if (formData.password && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Type your password again';
    } else if (
      formData.password &&
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = 'Passwords must match';
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch("http://13.52.231.140:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  const inputStyle = (field) =>
    `w-full px-4 py-2 rounded-lg bg-gray-700 ${errors[field] ? 'border-red-500' : 'border-gray-600'
    } border text-white placeholder-gray-400 focus:outline-none`;

  return (
    <div className="container mx-auto">
      <section className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-center text-white mb-8">REGISTRATION</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="fullName">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className={inputStyle('fullName')}
              placeholder="Enter your first and last name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">⚠️ {errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle('email')}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">⚠️ {errors.email}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="username">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={inputStyle('username')}
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">⚠️ {errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={inputStyle('password')}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* Eye icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">⚠️ {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-2" htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputStyle('confirmPassword')}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showConfirmPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.confirmPassword}</p>
            )}
          </div>

          {/* Accept Terms */}
          <div className="flex items-start space-x-2">
            <input
              id="acceptedTerms"
              name="acceptedTerms"
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              className="mt-1"
            />
            <label htmlFor="acceptedTerms" className="text-sm text-gray-300">
              I agree to the{' '}
              <button
                type="button"
                className="text-green-500 hover:underline"
              >
                terms and conditions
              </button>
              .
            </label>
          </div>
          {errors.acceptedTerms && (
            <p className="text-red-500 text-sm mt-1">⚠️ {errors.acceptedTerms}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition duration-300"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 hover:text-green-600">
            Login here
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Register;
