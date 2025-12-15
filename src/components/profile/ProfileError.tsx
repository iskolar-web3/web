import { AlertCircle } from 'lucide-react';
import type { JSX } from 'react';

/**
 * Props for the ProfileError component
 */
interface ProfileErrorProps {
  /** Error message to display, or null if no error */
  error: string | null;
}

/**
 * ProfileError component
 * Displays error message with retry button when profile fails to load
 * @param props - Component props
 * @returns Error display component with retry functionality
 */
export default function ProfileError({ error }: ProfileErrorProps): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <AlertCircle className="w-16 h-16 text-[#EF4444] mx-auto mb-4" />
        <h2 className="text-xl text-primary mb-2">Failed to Load Profile</h2>
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