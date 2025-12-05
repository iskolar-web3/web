import { useState, useRef, useEffect } from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Search, Home, Compass, WalletCards, Plus, Repeat, Bell, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';

type UserRole = 'student' | 'sponsor';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface HeaderNavProps {
  role: UserRole;
}

const studentNavItems: NavItem[] = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Discover', path: '/discover', icon: Compass },
  { label: 'Transactions', path: '/transactions', icon: Repeat },
];

const sponsorNavItems: NavItem[] = [
  { label: 'Scholarships', path: '/scholarships', icon: WalletCards },
  { label: 'Create', path: '/create', icon: Plus },
  { label: 'Transactions', path: '/transactions', icon: Repeat },
];

export default function HeaderNav({ role }: HeaderNavProps) {
  const router = useRouterState();
  const navigate = useNavigate();
  const currentPath = router.location.pathname;
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showTransactionsTooltip, setShowTransactionsTooltip] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const navItems = role === 'student' ? studentNavItems : sponsorNavItems;
  const logoRedirectPath = role === 'student' ? '/home' : '/scholarships';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }

      // Close search when clicking outside on mobile
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        isSearchExpanded
      ) {
        setIsSearchExpanded(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  // Focus input when search expands
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleLogoClick = () => {
    navigate({ to: logoRedirectPath });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search query:', searchQuery);
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchClose = () => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const isActiveRoute = (path: string) => {
    // Handle exact matches
    if (path === '/home') {
      return currentPath === '/home';
    }
    if (path === '/discover') {
      return currentPath === '/discover';
    }
    if (path === '/scholarships') {
      return currentPath === '/scholarships' || currentPath.startsWith('/scholarship/');
    }
    if (path === '/create') {
      return currentPath === '/create';
    }
    if (path === '/transactions') {
      return currentPath === '/transactions';
    }
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-[#E0ECFF] z-50">
      <div className="w-full mx-auto px-4 md:px-14">
        <div className="flex items-center justify-between h-16 gap-4 relative">
          {/* Logo and Search */}
          <div className="flex items-center md:gap-4">
            {/* Logo */}
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex-shrink-0 cursor-pointer transition-opacity"
              aria-label="Go to home"
            >
              <img
                src="/logo.png"
                alt="iSkolar Logo"
                className="w-9 h-9 md:w-12 md:h-12"
              />
            </button>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block md:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(e);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                />
              </div>
            </div>

            {/* Search Icon - Mobile */}
            {!isSearchExpanded && (
              <button
                type="button"
                onClick={handleSearchIconClick}
                className="md:hidden p-2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Expanded Search Bar - Mobile */}
          {isSearchExpanded && (
            <div
              ref={searchContainerRef}
              className="absolute left-0 right-0 top-0 h-16 bg-white z-50 px-4 flex items-center gap-2 md:hidden"
            >
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit(e);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-[#E5E7EB] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSearchClose}
                className="p-2 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              const isTransactions = item.path === '/transactions';
              
              if (isTransactions) {
                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() => setShowTransactionsTooltip(true)}
                    onMouseLeave={() => setShowTransactionsTooltip(false)}
                  >
                    <div className="flex flex-col items-center gap-0.5 md:gap-1 cursor-not-allowed opacity-60">
                      <Icon className="w-4 md:w-5 h-4 md:h-5 text-[#9CA3AF]" />
                      <span className="text-[11px] md:text-xs text-[#9CA3AF]">
                        {item.label}
                      </span>
                    </div>
                    
                    <AnimatePresence>
                      {showTransactionsTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-[#3A52A6] text-white text-[11px] md:text-xs rounded-md whitespace-nowrap z-50"
                        >
                          This feature is not available yet
                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#111827]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-0.5 md:gap-1 transition-colors"
                >
                  <Icon
                    className={`w-4 md:w-5 h-4 md:h-5 ${
                      isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'
                    }`}
                  />
                  <span
                    className={`text-[11px] md:text-xs ${
                      isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Notifications and Profile */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 cursor-pointer text-[#9CA3AF] hover:text-[#111827] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 md:w-5 h-4 md:h-5" />
              {/* TODO: Add notification badge if there are unread notifications */}
            </button>

            {/* Profile Circle */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center hover:ring-2 hover:ring-[#3A52A6] hover:ring-offset-2 transition-all cursor-pointer"
                aria-label="Profile menu"
              >
                <User className="w-4 md:w-5h-4 md:h-5 text-[#6B7280]" />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}