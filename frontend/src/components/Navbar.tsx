import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Landmark, Menu, X, LogOut, LayoutDashboard, ArrowRightLeft, PiggyBank, User, Home, Info, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { label: 'Home', path: '/', icon: Home, public: true },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, public: false },
  { label: 'Transactions', path: '/transactions', icon: ArrowRightLeft, public: false },
  { label: 'Loan', path: '/loan', icon: PiggyBank, public: false },
  { label: 'Account', path: '/account', icon: User, public: false },
  { label: 'About Us', path: '/about', icon: Info, public: true },
  { label: 'Contact', path: '/contact', icon: Phone, public: true },
];

export default function Navbar() {
  const { isLoggedIn, logout, user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = navItems.filter((item) => item.public || isLoggedIn);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-accent-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-navy-900">
              Nova<span className="text-accent-600">Bank</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive(item.path)
                      ? 'bg-accent-50 text-accent-700'
                      : 'text-navy-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-500">Hello, {user?.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-navy-700 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors shadow-sm"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-navy-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col gap-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-accent-50 text-accent-700'
                        : 'text-navy-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t border-gray-100">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-navy-900 text-white text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-lg text-navy-700 text-sm font-medium border border-gray-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
