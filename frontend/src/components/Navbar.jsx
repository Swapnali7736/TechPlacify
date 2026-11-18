import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, BarChart3, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-1.5">
                TechPlacify
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-1">
                Placement Predictor & Career Engine
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive('/')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Predictor</span>
                </Link>

                <Link
                  to="/history"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive('/history')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>History</span>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-semibold text-slate-900">{user.username}</span>
                    {user.cgpa && (
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded-full font-bold">
                        {user.cgpa} CGPA
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="flex items-center space-x-1 text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs hidden md:inline font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg shadow-sm shadow-indigo-200 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
