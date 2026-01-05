import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Loader2, Copy, Check } from 'lucide-react';
import { type CredentialData } from '@/lib/contracts';
import { getIPFSUrl } from '@/utils/ipfs.utils';

interface CredentialDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: bigint;
  credentialData: CredentialData;
}

export default function CredentialDetailsModal({ 
  isOpen, 
  onClose, 
  tokenId, 
  credentialData 
}: CredentialDetailsModalProps) {
  const documentUrl = credentialData.documentURI?.startsWith('ipfs://') 
    ? getIPFSUrl(credentialData.documentURI)
    : credentialData.documentURI;

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status, Visuals, & Links */}
          <div className="space-y-5">
            {/*Status */}
            <div className="flex items-center gap-2 text-xs uppercase">
                <span className={`${credentialData.revoked ? 'text-[#EF4444]' : 'text-[#31D0AA]'}`}>{credentialData.revoked ? 'Revoked' : 'Active'}</span>
            </div>

            {/* Document Preview */}
            <div className="w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div style={{ aspectRatio: '297/210' }} className="w-full relative group">
                {documentUrl ? (
                  <img
                    src={documentUrl}
                    alt={credentialData.credentialName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FileText className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-1 grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="w-full cursor-pointer flex items-center justify-center gap-2 h-10 border-primary/20 hover:border-primary/50 hover:bg-secondary/5 text-primary"
                disabled={!documentUrl}
                onClick={() => documentUrl && window.open(documentUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                View Document
              </Button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-2">
            <h4 className="text-sm text-primary flex items-center">
              Credential Details
            </h4>
            {/* Basic Info */}
            <div className="space-y-2">
              <div>
                <label className="text-xs text-primary/80 uppercase tracking-wider">Credential Name</label>
                <h3 className="text-sm text-primary mt-0.5">{credentialData.credentialName}</h3>
              </div>
              
              <div>
                  <label className="text-xs text-primary/80 uppercase tracking-wider">Type</label>
                  <p className="text-sm text-primary mt-0.5">{credentialData.credentialType}</p>
              </div>

              <div>
                  <label className="text-xs text-primary/80 uppercase tracking-wider">Issued Date</label>
                  <p className="text-sm text-primary mt-0.5">{credentialData.issuedDate || 'N/A'}</p>
              </div>

              <div>
                <label className="text-xs text-primary/80 uppercase tracking-wider">Issuing Institution</label>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-primary">{credentialData.issuingInstitution}</p>
                </div>
              </div>
            </div>

            <div className="h-1 border-t border-primary/10 my-4"></div>

            {/* Blockchain Details */}
            <div className="space-y-2">
              <h4 className="text-sm text-primary flex items-center">
                Blockchain Details
              </h4>
              
              <div className="rounded-sm space-y-2">
                {/* Token ID */}
                <div className="flex items-center justify-between">
                  <div className='flex items-center gap-2'>
                    <p className="text-xs text-primary/80 uppercase">Token ID: </p>
                    <p className="text-sm text-primary">{tokenId.toString()}</p>
                  </div>
                </div>

                {/* Transaction Hash
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-xs text-gray-500 font-medium">Transaction Hash</p>
                    {isLoadingTx ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                        <span className="text-xs text-gray-400">Fetching...</span>
                      </div>
                    ) : txHash ? (
                      <p className="text-sm font-mono text-gray-700 mt-0.5 truncate" title={txHash}>
                        {txHash}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-0.5 italic">Not available</p>
                    )}
                  </div>
                  {txHash && (
                    <button 
                      onClick={() => copyToClipboard(txHash, setCopiedTxHash)}
                      className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
                      title="Copy Transaction Hash"
                    >
                      {copiedTxHash ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
