import { createFileRoute } from '@tanstack/react-router';
import { User, Building2, Phone, Briefcase, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useUserProfile } from '@/hooks/queries/useUserProfile';
import Toast from '@/components/Toast';
import InfoField from '@/components/profile/InfoField';
import SelectField from '@/components/profile/SelectField';
import DateField from '@/components/profile/DateField';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { ProfileError } from '@/components/profile/ProfileError';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditHeader } from '@/components/profile/EditHeader';
import type { 
  IndividualSponsorProfile, 
  OrganizationSponsorProfile, 
  GovernmentSponsorProfile, 
} from '@/types/profile.types';
import { getDisplayName } from '@/utils/profile.utils';
import { z } from 'zod';

export const Route = createFileRoute('/_sponsor/profile/sponsor/$sponsorId')({
  // params: {
  //   parse: (params) => {
  //     const schema = z.object({
  //       sponsorId: z.string().uuid('Invalid ID format'),
  //     });
  //     return schema.parse(params);
  //   },
  //   stringify: (params) => ({
  //     sponsorId: params.sponsorId,
  //   }),
  // },
  component: SponsorProfile,
});

type SponsorProfile = IndividualSponsorProfile | OrganizationSponsorProfile | GovernmentSponsorProfile;

function SponsorProfile() {
  usePageTitle('Profile');

  const { sponsorId } = Route.useParams();
  const { data: profile, isLoading, error, isError } = useUserProfile(sponsorId);
  
  const [localProfile, setLocalProfile] = useState<SponsorProfile | null>(
    profile && (profile.role === 'individual_sponsor' || profile.role === 'organization_sponsor' || profile.role === 'government_sponsor')
      ? (profile as SponsorProfile)
      : null
  );
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
  if (profile && (profile.role === 'individual_sponsor' || profile.role === 'organization_sponsor' || profile.role === 'government_sponsor') && localProfile?.user_id !== profile.user_id) {
    setLocalProfile(profile as SponsorProfile);
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !localProfile || !profile) {
    return <ProfileError error={error?.message || 'Failed to load profile'} />;
  }

  const isIndividual = profile.role === 'individual_sponsor';
  const isOrganization = profile.role === 'organization_sponsor';
  const isGovernment = profile.role === 'government_sponsor';

  return (
    <div className="min-h-screen">
      {toast && <Toast {...toast} />}
      <div className="max-w-[44rem] mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] overflow-hidden"
        > 
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
              <ProfileAvatar isIndividual={isIndividual} />
              <ProfileHeader 
                name={getDisplayName(profile)}
                role={profile.role}
                email={profile.email}
                contactNumber={profile.contact_number}
              />
            </div>
          </div>
        </motion.div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-[#E0ECFF] p-6"
        >
          <EditHeader
            title={
              isIndividual ? 'Personal Information' :
              isOrganization ? 'Organization Information' :
              'Government Agency Information'
            }
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleEditClick}
            onCancel={handleCancelEdit}
            onSave={handleSaveEdit}
          />
          
          {isIndividual && (
            <IndividualSponsorFields
              profile={profile as IndividualSponsorProfile}
              editedProfile={editedProfile as IndividualSponsorProfile}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
              onDateChange={handleDateChange}
            />
          )}

          {isOrganization && (
            <OrganizationSponsorFields
              profile={profile as OrganizationSponsorProfile}
              editedProfile={editedProfile as OrganizationSponsorProfile}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
            />
          )}

          {isGovernment && (
            <GovernmentSponsorFields
              profile={profile as GovernmentSponsorProfile}
              editedProfile={editedProfile as GovernmentSponsorProfile}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ProfileAvatar({ isIndividual }: { isIndividual: boolean }) {
  return (
    <div className="relative">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-1 shadow-lg">
        <div className="w-full h-full rounded-full bg-[#3A52A6] flex items-center justify-center">
          {isIndividual ? (
            <User className="w-12 h-12 md:w-14 md:h-14 text-white" />
          ) : (
            <Building2 className="w-12 h-12 md:w-14 md:h-14 text-white" />
          )}
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

function IndividualSponsorFields({ profile, editedProfile, isEditing, onFieldChange, onDateChange }: {
  profile: IndividualSponsorProfile;
  editedProfile: IndividualSponsorProfile | null;
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
}) {
  const current = isEditing && editedProfile ? editedProfile : profile;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InfoField label="Name" value={current.full_name} isEditing={isEditing} onChange={(v) => onFieldChange('full_name', v)} />
      <SelectField 
        label="Employment Type" 
        value={current.employment_type}
        options={[
          { value: 'employed', label: 'Employed' },
          { value: 'self_employed', label: 'Self Employed' },
          { value: 'freelancer', label: 'Freelancer' },
          { value: 'overseas_filipino_worker', label: 'Overseas Filipino Worker' },
          { value: 'student', label: 'Student' },
        ]}
        icon={<Briefcase className="w-4 h-4 text-[#6B7280]" />}
        isEditing={isEditing}
        onChange={(v) => onFieldChange('employment_type', v)}
      />
      {current.date_of_birth && (
        <DateField label="Date of Birth" value={current.date_of_birth} isEditing={isEditing} onChange={onDateChange} />
      )}
      <InfoField 
        label="Contact Number" 
        value={current.contact_number}
        icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
        isEditing={isEditing}
        onChange={(v) => onFieldChange('contact_number', v)}
        type="tel"
      />
    </div>
  );
}

function OrganizationSponsorFields({ profile, editedProfile, isEditing, onFieldChange }: {
  profile: OrganizationSponsorProfile;
  editedProfile: OrganizationSponsorProfile | null;
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}) {
  const current = isEditing && editedProfile ? editedProfile : profile;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="md:col-span-2">
        <InfoField label="Organization Name" value={current.name} isEditing={isEditing} onChange={(v) => onFieldChange('name', v)} />
      </div>
      <SelectField 
        label="Organization Type" 
        value={current.organization_type}
        options={[
          { value: 'private_company', label: 'Private Company' },
          { value: 'non_governmental_organization', label: 'Non-Governmental Organization' },
          { value: 'educational_institution', label: 'Educational Institution' },
        ]}
        icon={<Building2 className="w-4 h-4 text-[#6B7280]" />}
        isEditing={isEditing}
        onChange={(v) => onFieldChange('organization_type', v)}
      />
      <InfoField 
        label="Contact Number" 
        value={current.contact_number}
        icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
        isEditing={isEditing}
        onChange={(v) => onFieldChange('contact_number', v)}
        type="tel"
      />
    </div>
  );
}

function GovernmentSponsorFields({ profile, editedProfile, isEditing, onFieldChange }: {
  profile: GovernmentSponsorProfile;
  editedProfile: GovernmentSponsorProfile | null;
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}) {
  const current = isEditing && editedProfile ? editedProfile : profile;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="md:col-span-2">
        <InfoField label="Agency Name" value={current.name} isEditing={isEditing} onChange={(v) => onFieldChange('name', v)} />
      </div>
      <SelectField 
        label="Agency Type" 
        value={current.agency_type}
        options={[
          { value: 'national_government_agency', label: 'National Government Agency' },
          { value: 'local_government_unit', label: 'Local Government Unit' },
          { value: 'government_owned_and_controlled_corporation', label: 'Government Owned and Controlled Corporation' },
        ]}
        icon={<Building2 className="w-4 h-4 text-[#6B7280]" />}
        isEditing={isEditing}
        onChange={(v) => onFieldChange('agency_type', v)}
      />
      <InfoField 
        label="Contact Number" 
        value={current.contact_number}
        icon={<Phone className="w-4 h-4 text-[#6B7280]" />}
        isEditing={isEditing}
        onChange={(v) => onFieldChange('contact_number', v)}
        type="tel"
      />
    </div>
  );
}