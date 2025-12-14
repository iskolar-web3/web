import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Props for the DescriptionModal component
 */
interface DescriptionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** Current description text */
  description: string;
  /** Callback function when description is saved */
  onSave: (description: string) => void;
}

/**
 * Description modal component for editing scholarship descriptions
 * Provides a textarea for entering detailed scholarship information
 * @param props - Component props
 * @returns Modal dialog with textarea for description editing
 */
export default function DescriptionModal({
  isOpen,
  onClose,
  description,
  onSave,
}: DescriptionModalProps) {
  const [tempDescription, setTempDescription] = useState(description);

  useEffect(() => {
    setTempDescription(description);
  }, [description, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#F0F7FF] rounded-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-secondary">Scholarship Description</h3>
          <button onClick={onClose} className="text-[#4A5568] hover:text-secondary">
            <X size={24} />
          </button>
        </div>
        <textarea
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          placeholder="Enter detailed description of the scholarship program..."
          className="w-full h-48 px-4 py-3 rounded-lg border border-[#C4CBD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3A52A6] resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer py-2.5 border border-[#C4CBD5] rounded-lg text-[#4A5568] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(tempDescription);
              onClose();
            }}
            className="flex-1 cursor-pointer py-2.5 bg-[#3A52A6] text-tertiary rounded-lg hover:bg-[#2A4296] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

