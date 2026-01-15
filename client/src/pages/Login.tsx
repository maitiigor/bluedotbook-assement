import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.user);
      navigate('/');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-200">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter username"
                    required
                />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter password"
                    required
                />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-500">
            <p>Try user: <span className="font-mono bg-gray-100 p-1 rounded">admin</span> pass: <span className="font-mono bg-gray-100 p-1 rounded">password123</span></p>
        </div>

        <div className="mt-6 text-center">
            <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
