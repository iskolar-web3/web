import { createFileRoute } from '@tanstack/react-router';
import { User, Phone, Edit, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useUserProfile } from '@/hooks/queries/useUserProfile';
import Toast from '@/components/Toast';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import ProfileError from '@/components/profile/ProfileError';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EditHeader from '@/components/profile/EditHeader';
import InfoField from '@/components/profile/InfoField';
import SelectField from '@/components/profile/SelectField';
import DateField from '@/components/profile/DateField';
import CredentialUploadModal from '@/components/student/CredentialUploadModal';
import CredentialsList from '@/components/student/CredentialsList';
import type { StudentProfile } from '@/types/profile.types';

export const Route = createFileRoute('/_student/profile/student/$studentId')({
  component: StudentProfilePage,
});

function StudentProfilePage() {
  usePageTitle('Profile');

  const { studentId } = Route.useParams();
  const { data: profile, isLoading, error, isError } = useUserProfile(studentId);

  const [localProfile, setLocalProfile] = useState<StudentProfile | null>(
    profile && profile.role === 'student' ? (profile as StudentProfile) : null
  );
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const { toast, showSuccess, showError } = useToast();

  const {
    isEditing,
    isSaving,
    editedProfile,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit,
    handleFieldChange,
    handleDateChange,
  } = useProfileForm(localProfile, setLocalProfile, { showSuccess, showError });

  // Update local profile when fetched profile changes
  if (profile && profile.role === 'student' && localProfile?.user_id !== profile.user_id) {
    setLocalProfile(profile as StudentProfile);
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !localProfile || !profile) {
    return <ProfileError error={error?.message || 'Failed to load profile'} />;
  }

  const currentProfile = (isEditing && editedProfile) ? editedProfile as StudentProfile : localProfile;

  const handleCredentialSuccess = () => {
    showSuccess('Credential uploaded successfully!', 'success', 1500);
  };

  return (
    <div className="min-h-screen">
      {toast && <Toast {...toast} />}
      
      {/* Credential Upload Modal */}
      <CredentialUploadModal
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        onSuccess={handleCredentialSuccess}
      />
      
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-lg shadow-sm border border-[#E0ECFF] overflow-hidden"
        >
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
              <ProfileAvatar />
              <ProfileHeader 
                name={localProfile.full_name}
                role={localProfile.role}
                email={localProfile.email}
                contactNumber={localProfile.contact_number}
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

        {/* Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg text-primary">
                Credentials
              </h2>
            </div>
            <button
              onClick={() => setIsCredentialModalOpen(true)}
              className="px-4 py-2 cursor-pointer bg-[#3B5AA8] hover:bg-[#2f4389] text-white text-xs font-medium rounded-sm transition-colors flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              Add Credential
            </button>
          </div>

          <CredentialsList />
        </motion.div>
      </div>
    </div>
  );
}

function ProfileAvatar() {
  return (
    <div className="relative">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-1 shadow-lg">
        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
          <User className="w-12 h-12 md:w-14 md:h-14 text-[#6B7280]" />
        </div>
      </div>
      <button
        className="absolute bottom-0 right-0 w-8 h-8 bg-secondary hover:bg-[#2f4389] rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
        title="Edit profile picture"
        aria-label="Edit profile picture"
      >
        <Edit className="w-4 h-4 text-tertiary" />
      </button>
    </div>
  );
}