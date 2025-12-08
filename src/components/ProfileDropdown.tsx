import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';
import { authService } from '@/services/auth.service';

interface ProfileDropdownProps {
  onClose: () => void;
}

// Mock user data - TODO: Replace with actual user data from context/store
const mockUser = {
  name: 'Louigie Caminoy',
  profileImage: null, // or a default image URL
};

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.removeToken();
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAccountClick = () => {
    onClose();
    // TODO: Navigate to account page when it's created
    // navigate({ to: '/account' });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-8 md:top-10 mt-2 w-40 md:w-56 bg-white rounded-lg rounded-bl-lg rounded-br-lg shadow-lg border border-[#E5E7EB] z-50 overflow-hidden"
      >
        {/* Profile Section */}
        <button
          type="button"
          onClick={handleAccountClick}
          className="w-full px-3 md:px-4 py-2 md:py-3 border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0">
              {mockUser.profileImage ? (
                <img
                  src={mockUser.profileImage}
                  alt={mockUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 md:w-5h-4 md:h-5 text-[#6B7280]" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-[#111827] truncate">
                {mockUser.name}
              </p>
            </div>
          </div>
        </button>

        {/* Account Option */}
        <button
          type="button"
          onClick={handleAccountClick}
          className="w-full px-3 cursor-pointer md:px-4 py-2 md:py-3 text-left text-xs md:text-sm text-[#6B7280] hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]"
        >
          Account
        </button>

        {/* Logout Option */}
        <button
          type="button"
          onClick={() => setShowLogoutConfirmation(true)}
          className="w-full px-3 md:px-4 py-2 md:py-3 cursor-pointer text-left text-xs md:text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
        >
          Logout
        </button>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirmation && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
            onClick={() => setShowLogoutConfirmation(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg text-[#111827] mb-2">
                Confirm Logout
              </h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Are you sure you want to logout? You will need to login again to access your account.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirmation(false)}
                  className="px-4 py-2 cursor-pointer text-sm text-[#6B7280] hover:bg-[#F9FAFB] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 cursor-pointer text-sm text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

