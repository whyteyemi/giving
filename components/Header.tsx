import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Page } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/team', label: 'Team' },
    { path: '/programs', label: 'Programs' },
    { path: '/impact', label: 'Impact' },
    { path: '/get-involved', label: 'Get Involved' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
    // Force a reload to clear any lingering state
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/"
            className="flex-shrink-0 flex flex-col items-start"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-primary font-bold text-xl tracking-tight">GIVING WITHOUT LIMIT</span>
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">Spread the kindness</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-secondary ${isActive ? 'text-secondary' : 'text-primary'
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                )}

                <div className="relative">
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    title="User Menu"
                  >
                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-100 font-semibold"
                        >
                          <i className="fas fa-shield-alt mr-2"></i>
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-user-circle mr-2 text-gray-400"></i>
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <i className="fas fa-sign-out-alt mr-2 text-red-400"></i>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-gray-600'
                  }`
                }
              >
                Login
              </NavLink>
            )}

            <Link
              to="/donate"
              className="bg-gold text-primary font-bold px-6 py-2 rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 ml-2"
            >
              DONATE
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4 animate-count">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="border-t border-gray-100 pt-2 mt-2">
              {user ? (
                <>
                  {isAdmin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    My Profile
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out ({profile?.full_name || user.email})
                  </button>
                </>
              ) : (
                <NavLink
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  Login
                </NavLink>
              )}
            </div>

            <Link
              to="/donate"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-gold text-primary font-bold mt-4 px-3 py-3 rounded-md"
            >
              DONATE NOW
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
