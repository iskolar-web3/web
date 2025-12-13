import { createFileRoute } from '@tanstack/react-router';
import { User, Phone, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { useProfileForm } from '@/hooks/useProfileForm';
import Toast from '@/components/Toast';
import { profileService } from '@/services/profile.service';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { ProfileError } from '@/components/profile/ProfileError';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditHeader } from '@/components/profile/EditHeader';
import InfoField from '@/components/profile/InfoField';
import SelectField from '@/components/profile/SelectField';
import DateField from '@/components/profile/DateField';
import type { StudentProfile } from '@/types/profile.types';
import { mockStudentUser } from '@/mocks/userProfile.mock';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

const USE_MOCK_DATA = import.meta.env.DEV;

export const Route = createFileRoute('/_student/profile/student/$studentId')({
  component: StudentProfilePage,
});

function StudentProfilePage() {
  usePageTitle('Profile');

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    isEditing,
    isSaving,
    editedProfile,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit,
    handleFieldChange,
    handleDateChange,
  } = useProfileForm(profile, setProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await profileService.getUserProfile();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (result.success && result.profile?.role === 'student') {
          setProfile(result.profile);
          setError(null);
        } else {
          if (USE_MOCK_DATA) {
            logger.info('Using mock student data for development');
            setProfile(mockStudentUser);
          } else {
            setError(result.message || 'Failed to load profile');
          }
        }
      } catch (err) {
        const handled = handleError(err, 'Failed to fetch profile');
        logger.error('Fetch student profile error:', handled.raw);
        
        if (USE_MOCK_DATA) {
          logger.info('Using mock student data as fallback');
          setProfile(mockStudentUser);
        } else {
          setError(handled.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return <ProfileError error={error} />;
  }

  const currentProfile = (isEditing && editedProfile) ? editedProfile as StudentProfile : profile;

  return (
    <div className="min-h-screen">
      {toast && <Toast {...toast} />}
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
              <ProfileAvatar />
              <ProfileHeader 
                name={profile.full_name}
                role={profile.role}
                email={profile.email}
                contactNumber={profile.contact_number}
              />
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
        >
          <EditHeader
            title="Personal Information"
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleEditClick}
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <InfoField 
              label="Full Name" 
              value={currentProfile.full_name}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange('full_name', value)}
            />
            <SelectField 
              label="Gender" 
              value={currentProfile.gender}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange('gender', value)}
            />
            <DateField
              label="Date of Birth"
              value={currentProfile.date_of_birth}
              isEditing={isEditing}
              onChange={handleDateChange}
            />
            <InfoField
              label="Contact Number"
              value={currentProfile.contact_number}
              icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange('contact_number', value)}
              type="tel"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileAvatar() {
  return (
    <div className="relative">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-1 shadow-lg">
        <div className="w-full h-full rounded-full bg-[#3A52A6] flex items-center justify-center">
          <User className="w-12 h-12 md:w-14 md:h-14 text-white" />
        </div>
      </div>
      <button
        className="absolute bottom-0 right-0 w-8 h-8 bg-[#EFA508] hover:bg-[#D89407] rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
        title="Edit profile picture"
        aria-label="Edit profile picture"
      >
        <Edit className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
