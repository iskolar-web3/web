import { useState, useCallback } from 'react';
import { profileService } from '@/services/profile.service';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { formatDateToString } from '@/utils/profile.utils';
import type { UserProfile } from '@/types/profile.types';

interface ToastMethods {
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
}

/**
 * Custom hook for managing profile edit functionality
 * Handles edit mode state, field updates, and save operations
 * 
 * @param profile - Current user profile
 * @param setProfile - Function to update profile state
 * @param toastMethods - Toast notification methods from useToast hook
 * @returns Object containing edit state and handlers
 */
export function useProfileForm<T extends UserProfile>(
  profile: T | null,
  setProfile: (profile: T | null) => void,
  toastMethods: ToastMethods
) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<T | null>(null);
  const { showSuccess, showError } = toastMethods;

  const handleEditClick = useCallback(() => {
    setEditedProfile(profile);
    setIsEditing(true);
  }, [profile]);

  const handleCancelEdit = useCallback(() => {
    setEditedProfile(null);
    setIsEditing(false);
  }, []);

  const handleSaveEdit = useCallback(async () => {
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
  }, [editedProfile, setProfile, showSuccess, showError]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value,
    } as T);
  }, [editedProfile]);

  const handleDateChange = useCallback((date: Date | undefined) => {
    if (!editedProfile || !date) return;
    const formattedDate = formatDateToString(date);
    setEditedProfile({
      ...editedProfile,
      date_of_birth: formattedDate,
    } as T);
  }, [editedProfile]);

  return {
    isEditing,
    isSaving,
    editedProfile,
    handleEditClick,
    handleCancelEdit,
    handleSaveEdit,
    handleFieldChange,
    handleDateChange,
  };
}