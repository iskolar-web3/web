import { createFileRoute } from '@tanstack/react-router';
import { User, Building2, Mail, Phone, Calendar, Users, Briefcase, Edit, AlertCircle, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import { profileService } from '@/services/profile.service';
import { Skeleton } from '@/components/ui/skeleton';
import type { 
  IndividualSponsorProfile, 
  OrganizationSponsorProfile, 
  GovernmentSponsorProfile, 
} from '@/types/profile.types';
import { 
  mockIndividualSponsorUser,
} from '@/mocks/userProfile.mock';
import { formatDate, getDisplayName, getRoleLabel, parseDateString } from '@/utils/profile.utils';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

// Toggle for using mock data during development
const USE_MOCK_DATA = import.meta.env.DEV;

export const Route = createFileRoute('/_sponsor/profile/sponsor/$sponsorId')({
  component: SponsorProfile,
});

type SponsorProfile = IndividualSponsorProfile | OrganizationSponsorProfile | GovernmentSponsorProfile;

/**
 * Profile page component
 * Displays comprehensive user information based on role
 * Automatically detects user type and shows appropriate fields
 */
function SponsorProfile() {
  usePageTitle('Profile');
  
  const [profile, setProfile] = useState<SponsorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<SponsorProfile | null>(null);
  const { toast, showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await profileService.getUserProfile();
        
        // Simulate 2-second loading delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (result.success && result.profile) {
          // Type guard to ensure we have a sponsor profile
          const userProfile = result.profile;
          if (
            userProfile.role === 'individual_sponsor' ||
            userProfile.role === 'organization_sponsor' ||
            userProfile.role === 'government_sponsor'
          ) {
            setProfile(userProfile);
            setError(null);
          } else {
            // Use mock data in development for wrong profile type
            if (USE_MOCK_DATA) {
              logger.info('Using mock organization sponsor data for development');
              setProfile(mockIndividualSponsorUser);
            } else {
              setError('Profile type mismatch - not a sponsor');
            }
          }
        } else {
          // Use mock data in development, show error in production
          if (USE_MOCK_DATA) {
            logger.info('Using mock organization sponsor data for development');
            setProfile(mockIndividualSponsorUser);
          } else {
            setError(result.message || 'Failed to load profile');
          }
        }
      } catch (err) {
        const handled = handleError(err, 'Failed to fetch profile');
        logger.error('Fetch sponsor profile error:', handled.raw);
        
        // Use mock data in development, show error in production
        if (USE_MOCK_DATA) {
          logger.info('Using mock organization sponsor data as fallback in development');
          setProfile(mockIndividualSponsorUser);
        } else {
          setError(handled.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedProfile(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editedProfile) return;

    setIsSaving(true);
    try {
      const result = await profileService.updateProfile(editedProfile);
      if (result.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        setEditedProfile(null);
        showSuccess('Profile Updated', 'Your profile has been updated successfully', 2500);
        logger.info('Profile updated successfully');
      } else {
        showError('Update Failed', result.message || 'Failed to update profile', 3000);
        logger.error('Failed to update profile:', result.message);
      }
    } catch (err) {
      const handled = handleError(err, 'Failed to update profile');
      logger.error('Update profile error:', handled.raw);
      showError('Error', handled.message, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!editedProfile || !date) return;
    const formattedDate = date.toISOString().split('T')[0];
    setEditedProfile({
      ...editedProfile,
      date_of_birth: formattedDate,
    } as SponsorProfile);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[44rem] mx-auto space-y-6 p-4 md:p-0">
          {/* Profile Header Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
                {/* Avatar Skeleton */}
                <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full flex-shrink-0 bg-muted-foreground" />

                {/* Info Skeleton */}
                <div className="flex-1 text-center md:text-left w-full">
                  <Skeleton className="h-8 w-full mb-3 bg-muted-foreground mx-auto md:mx-0" />
                  <Skeleton className="h-5 w-28 mb-4 bg-muted-foreground mx-auto md:mx-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-56 bg-muted-foreground mx-auto md:mx-0" />
                    <Skeleton className="h-4 w-48 bg-muted-foreground mx-auto md:mx-0" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Information Section Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-48 bg-muted-foreground" />
              <Skeleton className="h-9 w-9 rounded-lg bg-muted-foreground" />
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`field-${index}`}>
                  <Skeleton className="h-4 w-24 mb-2 bg-muted-foreground" />
                  <Skeleton className="h-11 w-full bg-muted-foreground rounded-lg" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-xl text-primary mb-2 ">Failed to Load Profile</h2>
          <p className="text-[#6B7280] mb-4">{error || 'An unexpected error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#3A52A6] hover:bg-[#2f4389] text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isIndividualSponsor = profile.role === 'individual_sponsor';
  const isOrganizationSponsor = profile.role === 'organization_sponsor';
  const isGovernmentSponsor = profile.role === 'government_sponsor';

  return (
    <div className="min-h-screen">
      {toast && <Toast {...toast} />}
      <div className="max-w-[44rem] mx-auto space-y-6">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] overflow-hidden"
        > 
          {/* Profile Content */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#3A52A6] flex items-center justify-center">
                    {isIndividualSponsor ? (
                      <User className="w-12 h-12 md:w-14 md:h-14 text-white" />
                    ) : (
                      <Building2 className="w-12 h-12 md:w-14 md:h-14 text-white" />
                    )}
                  </div>
                </div>
                {/* Edit Icon */}
                <button
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#EFA508] hover:bg-[#D89407] rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
                  title="Edit profile picture"
                  aria-label="Edit profile picture"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Name & Info */}
              <div className="flex-1 text-center md:text-left mt-4 md:mt-6">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h2 className="text-xl md:text-2xl text-primary ">
                    {getDisplayName(profile)}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0ECFF] text-[#3A52A6] text-xs md:text-sm rounded-md mx-auto md:mx-0 w-fit ">
                    <Users className="w-3.5 h-3.5" />
                    {getRoleLabel(profile.role)}
                  </span>
                </div>
                
                <div className="flex flex-col items-center md:items-start justify-center md:justify-start gap-2 text-[#6B7280] text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{profile.contact_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Individual Sponsor Information */}
        {isIndividualSponsor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl text-primary">
                Personal Information
              </h3>

              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="px-2 py-2 bg-[#3A52A6] hover:bg-[#2f4389] text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-xs"
                  title="Edit profile"
                  aria-label="Edit profile"
                >
                  <Edit className="h-3 w-3 md:w-4 md:h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-3 py-2 bg-[#F0F7FF] border border-[#D1D5DB] hover:bg-[#D9E9FF] text-primary rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cancel"
                    aria-label="Cancel"
                  >
                    <X className="h-3 w-3 md:w-4 md:h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="px-3 py-2 bg-[#efa508] hover:bg-[#D89407] text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save"
                    aria-label="Save"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-3 w-3 md:w-4 md:h-4" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <InfoField 
                label="Name" 
                value={isEditing && editedProfile ? (editedProfile as IndividualSponsorProfile).full_name : (profile as IndividualSponsorProfile).full_name}
                isEditing={isEditing}
                onChange={(value) => handleFieldChange('full_name', value)}
              />
              <SelectField 
                label="Employment Type" 
                value={isEditing && editedProfile ? (editedProfile as IndividualSponsorProfile).employment_type : (profile as IndividualSponsorProfile).employment_type}
                options={[
                  { value: 'employed', label: 'Employed' },
                  { value: 'self_employed', label: 'Self Employed' },
                  { value: 'freelancer', label: 'Freelancer' },
                  { value: 'overseas_filipino_worker', label: 'Overseas Filipino Worker' },
                  { value: 'student', label: 'Student' },
                ]}
                icon={<Briefcase className="w-4 h-4 text-[#6B7280]" />}
                isEditing={isEditing}
                onChange={(value) => handleFieldChange('employment_type', value)}
              />
              {(profile as IndividualSponsorProfile).date_of_birth && (
                <DateField 
                  label="Date of Birth" 
                  value={isEditing && editedProfile ? (editedProfile as IndividualSponsorProfile).date_of_birth : (profile as IndividualSponsorProfile).date_of_birth}
                  isEditing={isEditing}
                  onChange={handleDateChange}
                />
              )}
              <InfoField 
                label="Contact Number" 
                value={isEditing && editedProfile ? editedProfile.contact_number : profile.contact_number}
                icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
                isEditing={isEditing}
                onChange={(value) => handleFieldChange('contact_number', value)}
              />
            </div>
          </motion.div>
        )}

        {/* Organization Sponsor Information */}
        {isOrganizationSponsor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl text-primary">Organization Information</h3>
              
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="px-2 py-2 bg-[#3A52A6] hover:bg-[#2f4389] text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-xs"
                  title="Edit profile"
                  aria-label="Edit profile"
                >
                  <Edit className="h-3 w-3 md:w-4 md:h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-3 py-2 bg-[#F0F7FF] border border-[#D1D5DB] hover:bg-[#D9E9FF] text-primary rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-3 w-3 md:w-4 md:h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="px-3 py-2 bg-[#efa508] hover:bg-[#D89407] text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-3 w-3 md:w-4 md:h-4" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <InfoField 
                  label="Organization Name" 
                  value={isEditing && editedProfile ? (editedProfile as OrganizationSponsorProfile).name : (profile as OrganizationSponsorProfile).name}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('name', value)}
                />
              </div>
              <SelectField 
                label="Organization Type" 
                value={isEditing && editedProfile ? (editedProfile as OrganizationSponsorProfile).organization_type : (profile as OrganizationSponsorProfile).organization_type}
                options={[
                  { value: 'private_company', label: 'Private Company' },
                  { value: 'non_governmental_organization', label: 'Non-Governmental Organization' },
                  { value: 'educational_institution', label: 'Educational Institution' },
                ]}
                icon={<Building2 className="w-4 h-4 text-[#6B7280]" />}
                isEditing={isEditing}
                onChange={(value) => handleFieldChange('organization_type', value)}
              />
              <InfoField 
                label="Contact Number" 
                value={isEditing && editedProfile ? editedProfile.contact_number : profile.contact_number}
                icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
                isEditing={isEditing}
                onChange={(value) => handleFieldChange('contact_number', value)}
              />
            </div>
          </motion.div>
        )}

        {/* Government Sponsor Information */}
        {isGovernmentSponsor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl text-primary">Government Agency Information</h3>
              
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="px-2 py-2 bg-[#3A52A6] hover:bg-[#2f4389] text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-xs"
                  title="Edit profile"
                  aria-label="Edit profile"
                >
                  <Edit className="h-3 w-3 md:w-4 md:h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-3 py-2 bg-[#F0F7FF] border border-[#D1D5DB] hover:bg-[#D9E9FF] text-primary rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-3 w-3 md:w-4 md:h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className="px-3 py-2 bg-[#efa508] hover:bg-[#D89407] text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-3 w-3 md:w-4 md:h-4" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <InfoField 
                  label="Agency Name" 
                  value={isEditing && editedProfile ? (editedProfile as GovernmentSponsorProfile).name : (profile as GovernmentSponsorProfile).name}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('name', value)}
                />
              </div>
              <SelectField 
                label="Agency Type" 
                value={isEditing && editedProfile ? (editedProfile as GovernmentSponsorProfile).agency_type : (profile as GovernmentSponsorProfile).agency_type}
                options={[
                  { value: 'national_government_agency', label: 'National Government Agency' },
                  { value: 'local_government_unit', label: 'Local Government Unit' },
                  { value: 'government_owned_and_controlled_corporation', label: 'Government Owned and Controlled Corporation' },
                ]}
                icon={<Building2 className="w-4 h-4 text-[#6B7280]" />}
                isEditing={isEditing}
                onChange={(value) => handleFieldChange('agency_type', value)}
              />
              <InfoField 
                label="Contact Number" 
                value={isEditing && editedProfile ? editedProfile.contact_number : profile.contact_number}
                icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
                isEditing={isEditing}
                onChange={(value) => handleFieldChange('contact_number', value)}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * Props for the InfoField component
 */
interface InfoFieldProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isEditing?: boolean;
  onChange?: (value: string) => void;
}

/**
 * Props for the SelectField component
 */
interface SelectFieldProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
  isEditing?: boolean;
  onChange?: (value: string) => void;
}

/**
 * Props for the DateField component
 */
interface DateFieldProps {
  label: string;
  value: string;
  isEditing?: boolean;
  onChange?: (date: Date | undefined) => void;
}

/**
 * Reusable info field component
 * Supports both view and edit modes
 */
function InfoField({ label, value, icon, isEditing = false, onChange }: InfoFieldProps) {
  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5 ">
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent text-sm md:text-base text-primary"
        />
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          {icon}
          <p className="text-sm md:text-base text-primary">{value}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable select field component
 * Supports both view and edit modes with dropdown options
 */
function SelectField({ label, value, options, icon, isEditing = false, onChange }: SelectFieldProps) {
  const displayLabel = options.find(opt => opt.value === value)?.label || value;
  
  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5 ">
        {label}
      </label>
      {isEditing ? (
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A52A6] focus:border-transparent text-sm md:text-base text-primary"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          {icon}
          <p className="text-sm md:text-base text-primary">{displayLabel}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable date field component with calendar picker
 * Supports both view and edit modes
 */
function DateField({ label, value, isEditing = false, onChange }: DateFieldProps) {
  const dateValue = value ? parseDateString(value) : undefined;
  
  return (
    <div>
      <label className="block text-xs md:text-sm text-[#6B7280] mb-1.5 ">
        {label}
      </label>
      {isEditing ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between ${
                dateValue ? 'text-primary' : 'text-gray-400'
              } border-[#D1D5DB] focus:border-[#3A52A6] focus:ring-[#3A52A6]/20`}
            >
              <span>
                {dateValue 
                  ? dateValue.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : 'Set birth date'}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateValue}
              onSelect={onChange}
              captionLayout="dropdown" 
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <div className="px-4 py-3 bg-[#F9FAFB] border border-border rounded-lg flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#6B7280]" />
          <p className="text-sm md:text-base text-primary">{formatDate(value)}</p>
        </div>
      )}
    </div>
  );
}