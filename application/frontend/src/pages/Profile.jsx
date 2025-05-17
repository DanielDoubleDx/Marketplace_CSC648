import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null); // Stores the user data
  const [loading, setLoading] = useState(true); // Indicates if data is still loading
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage or redirect to login
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        if (!parsedUser?.email) {
          throw new Error('Invalid user data');
        }

        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Profile</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{user.full_name || 'Not provided'}</h3>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <p className="text-white">{user.full_name || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                  <p className="text-white">{user.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Account Status</label>
                  <p className="text-white">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {user.status || 'Not provided'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
