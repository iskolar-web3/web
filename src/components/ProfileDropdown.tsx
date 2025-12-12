import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';
import type { UserProfile } from '@/types/profile.types';
import { handleError } from '@/lib/errorHandler'; 
import { logger } from "@/lib/logger";
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import { mockOrganizationSponsorUser, mockStudentUser, mockGovernmentSponsorUser, mockIndividualSponsorUser } from '@/mocks/userProfile.mock';

const USE_MOCK_DATA = true;

/**
 * Props for the ProfileDropdown component
 */
interface ProfileDropdownProps {
  /** Callback function to close the dropdown */
  onClose: () => void;
}

/**
 * Gets the display name based on user profile type using type guards
 * @param profile - User profile
 * @returns Display name
 */
function getDisplayName(profile: UserProfile): string {
  switch (profile.role) {
    case 'student':
    case 'individual_sponsor':
      return profile.full_name;
    case 'organization_sponsor':
    case 'government_sponsor':
    case 'school':
      return profile.name;
    default:
      // Exhaustiveness check
      return '';
  }
}

/**
 * Profile dropdown component
 * Displays user profile information with account and logout options
 * Redirects to appropriate profile page based on user role
 */
export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const { toast, showError } = useToast();

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch user profile on component mount
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const result = await profileService.getUserProfile();
        if (result.success && result.profile) {
          setUserProfile(result.profile);
        } else {
          if (USE_MOCK_DATA) {
            logger.info('Using mock data for development');
            setUserProfile(mockGovernmentSponsorUser);
          } else {
            showError(`Error`, result.message || 'Failed to load profile', 2500);
          }
        }
      } catch (err) {
        const handled = handleError(err, 'Failed to fetch user profile');
        logger.error('Fetch user profile error:', handled.raw);
        showError(`Error ${handled.code}`, handled.message, 2500);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  /**
   * Determines the profile route based on user role
   */
  const getProfileRoute = () => {
    if (!userProfile) return null;

    const userId = userProfile.user_id;
    
    switch (userProfile.role) {
      case 'student':
        return { to: '/profile/student/$studentId' as const, params: { studentId: userId } };
      case 'individual_sponsor':
      case 'organization_sponsor':
      case 'government_sponsor':
        return { to: '/profile/sponsor/$sponsorId' as const, params: { sponsorId: userId } };
      case 'school':
        // Uncomment when school route is ready
        // return { to: '/profile/school/$schoolId' as const, params: { schoolId: userId } };
        return null;
      default:
        return null;
    }
  };

  /**
   * Handles profile navigation
   */
  const handleProfileClick = () => {
    onClose();
    const route = getProfileRoute();
    if (route) {
      navigate(route);
    }
  };

  /**
   * Handles account navigation
   */
  const handleAccountClick = () => {
    onClose();
    // navigate({ to: '/account' });
  };

  /**
   * Handles user logout
   */
  const handleLogout = async () => {
    try {
      await authService.removeToken();
      navigate({ to: '/login' });
    } catch (err) {
      const handled = handleError(err, 'Failed to logout');
      logger.error('Logout error:', handled.raw);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} />}
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-8 md:top-10 mt-2 w-40 md:w-56 bg-white rounded-lg shadow-lg border border-border z-50 overflow-hidden"
      >
        {/* Profile Section */}
        <button
          type="button"
          onClick={handleProfileClick}
          disabled={!userProfile}
          className="w-full px-3 md:px-4 py-2 md:py-3 border-b border-border hover:bg-[#F9FAFB] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {userProfile && 'profileImage' in userProfile && (userProfile as any).profileImage ? (
                <img
                  src={(userProfile as any).profileImage}
                  alt={getDisplayName(userProfile)}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 md:w-5 h-4 md:h-5 text-[#6B7280]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {isLoading ? (
                <p className="text-xs md:text-sm text-[#6B7280]">Loading...</p>
              ) : userProfile ? (
                <p className="text-xs md:text-sm text-primary truncate">
                  {getDisplayName(userProfile)}
                </p>
              ) : null}
            </div>
          </div>
        </button>

        {/* Account Option */}
        <button
          type="button"
          onClick={handleAccountClick}
          disabled={!userProfile}
          className="w-full px-3 cursor-pointer md:px-4 py-2 md:py-3 text-left text-xs md:text-sm text-[#6B7280] hover:bg-[#F9FAFB] transition-colors border-b border-border disabled:cursor-not-allowed disabled:opacity-60"
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
              <h3 className="text-lg text-primary mb-2 font-semibold">
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