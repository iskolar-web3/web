import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';
import { type CredentialData } from '@/lib/contracts';
import { getIPFSUrl } from '@/utils/ipfs.utils';
import { useTokenURI } from '@/hooks/useNFTCredential';
import { getCredentialTxHash, getCredentialChainId, getExplorerTxUrl, getNetworkName } from '@/utils/txHashStorage';
import { useMemo } from 'react';

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
  const { tokenURI } = useTokenURI(tokenId);

  const documentUrl = credentialData.documentURI?.startsWith('ipfs://') 
    ? getIPFSUrl(credentialData.documentURI)
    : credentialData.documentURI;

  const metadataUrl = tokenURI?.startsWith('ipfs://')
    ? getIPFSUrl(tokenURI)
    : tokenURI;

  // Get stored transaction hash and chainId for this credential
  const txHash = useMemo(() => getCredentialTxHash(tokenId), [tokenId]);
  const storedChainId = useMemo(() => getCredentialChainId(tokenId), [tokenId]);
  const networkName = useMemo(() => {
    if (!storedChainId) return null;
    return getNetworkName(storedChainId);
  }, [storedChainId]);
  const explorerUrl = useMemo(() => {
    if (!txHash || !storedChainId) return null;
    return getExplorerTxUrl(storedChainId, txHash);
  }, [txHash, storedChainId]);

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
              <Button 
                variant="outline" 
                className="w-full cursor-pointer flex items-center justify-center gap-2 h-10 border-primary/20 hover:border-primary/50 hover:bg-secondary/5 text-primary"
                disabled={!metadataUrl}
                onClick={() => metadataUrl && window.open(metadataUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                View Metadata
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

              {credentialData.issuedDate &&
                <div>
                  <label className="text-xs text-primary/80 uppercase tracking-wider">Issued Date</label>
                  <p className="text-sm text-primary mt-0.5">{credentialData.issuedDate}</p>
                </div>
              }

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

                {/* Network */}
                {networkName && (
                  <div className="flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                      <p className="text-xs text-primary/80 uppercase">Network: </p>
                      <p className="text-sm text-primary">{networkName}</p>
                    </div>
                  </div>
                )}

                {/* Transaction Hash */}
                {txHash && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-primary/80 uppercase">Transaction:</p>
                      {explorerUrl ? (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary underline hover:text-secondary transition-colors break-all"
                        >
                          {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </a>
                      ) : (
                        <p className="text-sm text-primary break-all">
                          {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
