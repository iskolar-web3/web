import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useCredentialsByHolder, useCredential } from '@/hooks/useNFTCredential';
import { Award, FileText, Pencil, Eye } from 'lucide-react';
import { getIPFSUrl } from '@/utils/ipfs.utils';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import CredentialEditModal from './CredentialEditModal';
import CredentialDetailsModal from './CredentialDetailsModal';

export default function CredentialsList() {
  const { address } = useAccount();
  const { tokenIds, isLoading, error, refetch } = useCredentialsByHolder(address);
  const { toast, showSuccess } = useToast();

  // Sort tokenIds to display latest first 
  const sortedTokenIds = useMemo(() => {
    if (!tokenIds) return [];
    return [...tokenIds].reverse();
  }, [tokenIds]);

  if (!address) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Connect your wallet to view credentials</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    if (error.message.includes('returned no data') || error.message.includes('0x')) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No credentials found</p>
          <p className="text-xs mt-1">Click "Add Credential" to upload your first credential</p>
        </div>
      );
    }
    
    return (
      <div className="text-center py-8 text-[#EF4444]">
        <p className="text-sm">Error loading credentials: {error.message}</p>
      </div>
    );
  }

  if (!sortedTokenIds || sortedTokenIds.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No credentials found</p>
        <p className="text-xs mt-1">Click "Add Credential" to upload your first credential</p>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast {...toast} />}
      <div className="space-y-4">
        {sortedTokenIds.map((tokenId) => (
          <CredentialCard key={tokenId.toString()} tokenId={tokenId} onUpdate={refetch} onEditSuccess={showSuccess} />
        ))}
      </div>
    </>
  );
}

/**
 * Individual credential card component
 */
function CredentialCard({ tokenId, onUpdate, onEditSuccess }: { tokenId: bigint, onUpdate: () => void, onEditSuccess: (title: string, message: string, duration?: number) => void }) {
  const { address } = useAccount();
  const { credential, isLoading, refetch } = useCredential(tokenId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleSuccess = () => {
    refetch(); 
    onUpdate();
    onEditSuccess('Updated', 'Your changes have been saved.', 2500);
  };

  if (isLoading || !credential) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-32 bg-gray-200 rounded" style={{ aspectRatio: '210/297' }} />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  const documentUrl = credential.documentURI?.startsWith('ipfs://') 
    ? getIPFSUrl(credential.documentURI)
    : credential.documentURI;
  
  // Check if current user is the issuer
  const canEdit = address && credential.issuer === address;

  return (
    <>
      <div className="border border-gray-150 rounded-sm p-2 hover:border-secondary/50 transition-colors relative group">
        
        {/* Edit Button */}
        {canEdit && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-2 right-2 p-1.5 text-primary/75 hover:text-[#3B5AA8] hover:bg-gray-100 rounded-full transition-colors cursor-pointer z-10"
            title="Edit Credential"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        <div className="flex gap-4">
          {/* Document Thumbnail */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setIsViewModalOpen(true)}>
            {documentUrl ? ( 
              <div 
                className="w-34 bg-gray-50 rounded overflow-hidden transition-colors hover:opacity-90"
                style={{ aspectRatio: '297/210' }}
              >
                <img
                  src={documentUrl}
                  alt={credential.credentialName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-full bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200"
                style={{ aspectRatio: '297/210' }}
              >
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Credential Details */}
          <div className="flex-1 min-w-0 flex flex-col h-full">
            {/* Name */}
            <div className="mb-1 pr-8"> 
              <h3 
                className="text-[15px] text-primary cursor-pointer hover:text-secondary transition-colors"
                onClick={() => setIsViewModalOpen(true)}
              >
                {credential.credentialName}
              </h3>
            </div>

            {/* Issuing Institution */}
            <p className="text-[13px] text-primary/75">
              {credential.issuingInstitution}
            </p>

            {/* Issued Date */}
            {credential.issuedDate && (
              <p className="text-xs text-primary/55">
                Issued {credential.issuedDate}
              </p>
            )}

            {/* View Credential */}
            <div className="mt-auto pt-1.5">
              <button
                onClick={() => setIsViewModalOpen(true)}
                className="inline-flex items-center gap-1.25 text-xs text-secondary hover:underline cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>View credential</span>
              </button>
            </div>
          </div> 
        </div>
      </div>

      <CredentialEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tokenId={tokenId}
        credentialData={credential}
        onSuccess={handleSuccess}
      />

      <CredentialDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        tokenId={tokenId}
        credentialData={credential}
      />
    </>
  );
}

