import { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, Loader2, Wallet, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useUpdateCredential } from '@/hooks/useCredential';
import { format } from 'date-fns';
import { uploadToIPFS, uploadMetadataToIPFS, getIPFSUri, getIPFSUrl } from '@/utils/ipfs.utils';
import { type CredentialData } from '@/lib/contracts';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import {
  loadPDFJS,
  handleFileSelection,
  formatFileSize,
} from '@/utils/fileHandling.utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface CredentialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tokenId: bigint;
  credentialData: CredentialData;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const credentialSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  name: z.string().min(1, 'Name is required'),
  institution: z.string().min(1, 'Institution is required'),
  issuedDate: z.string().optional(),
});

type CredentialFormData = z.infer<typeof credentialSchema>;

export default function CredentialEditModal({ isOpen, onClose, onSuccess, tokenId, credentialData }: CredentialEditModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CredentialFormData>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      type: credentialData.credentialType,
      name: credentialData.credentialName,
      institution: credentialData.issuingInstitution,
      issuedDate: credentialData.issuedDate,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    credentialData.documentURI.startsWith('ipfs://') 
      ? getIPFSUrl(credentialData.documentURI)
      : credentialData.documentURI
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { updateCredential, isPending, isConfirming, isSuccess, error: contractError } = useUpdateCredential();
  const { toast, showError } = useToast();
  const hasHandledSuccess = useRef(false);

  // Load PDF.js when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPDFJS().catch((err) => {
        const handled = handleError(err, 'Failed to load PDF.js library');
        logger.error('PDF.js loading error:', handled.raw);
      });

      hasHandledSuccess.current = false;
    }
  }, [isOpen]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset input
    e.target.value = '';

    // Set loading state for PDF previews
    if (selectedFile.type === 'application/pdf') {
      setIsGeneratingPreview(true);
    }

    setUploadSuccess(false);

    try {
      const result = await handleFileSelection(selectedFile, {
        compress: true,
        waitForPDFJS: true,
      });

      if (result.error) {
        showError('File Error', result.error, 4000);
        setFile(null);
        setPreview(null);
        return;
      }

      setFile(result.file);
      setPreview(result.preview);
    } catch (error) {
      const handled = handleError(error, 'Failed to process file');
      logger.error('File handling error:', handled.raw);
      showError('File Error', handled.message, 4000);
      setFile(null);
      setPreview(null);
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [showError]);

  const removeFile = useCallback(() => {
    setFile(null);
    setPreview(null);
  }, []);

  const onFormSubmit = async (data: CredentialFormData) => {
    if (!isConnected || !address) {
      showError('Wallet Not Connected', 'Please connect your wallet to update credentials', 3000);
      return;
    }

    setIsUploading(true);
    
    try {
      let documentURI = credentialData.documentURI;

      // If a new file is uploaded, upload it to IPFS
      if (file) {
        const documentUpload = await uploadToIPFS(file, file.name);
        
        if (!documentUpload.success || !documentUpload.ipfsHash) {
          throw new Error(documentUpload.error || 'Failed to upload document.');
        }

        documentURI = getIPFSUri(documentUpload.ipfsHash);
      }

      // Format date as YYYY-MM
      const formattedDate = data.issuedDate 
        ? format(new Date(data.issuedDate), 'yyyy-MM')
        : '';

      // Create metadata object
      const metadata = {
        name: data.name,
        description: `${data.type} credential issued by ${data.institution}`,
        image: documentURI, 
        attributes: [
          {
            trait_type: 'Type',
            value: data.type,
          },
          {
            trait_type: 'Issuing Institution',
            value: data.institution,
          },
          {
            trait_type: 'Issued Date',
            value: formattedDate || 'Not specified',
          },
        ],
        properties: {
          credentialType: data.type,
          credentialName: data.name,
          issuingInstitution: data.institution,
          issuedDate: formattedDate,
          documentURI: documentURI,
        },
      };

      // Upload metadata to IPFS
      const metadataUpload = await uploadMetadataToIPFS(metadata, `credential-update-${Date.now()}.json`);
      
      if (!metadataUpload.success || !metadataUpload.ipfsHash) {
        throw new Error(metadataUpload.error || 'Failed to upload metadata.');
      }

      const tokenURI = getIPFSUri(metadataUpload.ipfsHash);

      // Update credential on-chain
      await updateCredential(
        tokenId,
        data.type,
        data.name,
        data.institution,
        formattedDate,
        documentURI,
        tokenURI,
      );
    } catch (err) {
      const handled = handleError(err, 'Failed to update credential. Please try again.');
      logger.error('Error updating credential:', handled.raw);
      showError('Update Failed', handled.message, 4000);
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isSuccess && !hasHandledSuccess.current) {
      hasHandledSuccess.current = true;
      setUploadSuccess(true);
      setIsUploading(false);
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [isSuccess, onSuccess, onClose]);

  useEffect(() => {
    if (contractError) {
      const errorMessage = contractError.message || 'Transaction failed';
      const isUserRejection = errorMessage.toLowerCase().includes('user rejected') || 
                              errorMessage.toLowerCase().includes('user denied') ||
                              errorMessage.toLowerCase().includes('rejected');
      const isDuplicate = errorMessage.toLowerCase().includes('credential already exists') ||
                          errorMessage.toLowerCase().includes('duplicate');
      
      if (isUserRejection) {
        showError('Transaction Rejected', 'You rejected the transaction in your wallet', 3000);
      } else if (isDuplicate) {
        showError('Duplicate Credential', 'This credential already exists. Please use different details.', 4000);
      } else {
        showError('Transaction Failed', errorMessage, 4000);
      }
      
      setIsUploading(false);
    }
  }, [contractError, showError]);

  const handleClose = useCallback(() => {
    const isLoading = isPending || isConfirming || isUploading;
    if (!isLoading) {
      onClose();
    }
  }, [isPending, isConfirming, isUploading, onClose]);

  const isLoading = isPending || isConfirming || isUploading;

  useEffect(() => {
    if (isOpen) {
      reset({
        type: credentialData.credentialType,
        name: credentialData.credentialName,
        institution: credentialData.issuingInstitution,
        issuedDate: credentialData.issuedDate,
      });
      setPreview(
        credentialData.documentURI.startsWith('ipfs://') 
          ? getIPFSUrl(credentialData.documentURI)
          : credentialData.documentURI
      );
      setFile(null);
      setUploadSuccess(false);
    }
  }, [isOpen, credentialData, reset]);


  return (
    <>
      {toast && <Toast {...toast} />}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="!max-w-2xl max-h-[90vh] flex flex-col p-0" showCloseButton={!isLoading}>
          <DialogHeader className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-lg text-gray-900">Edit credential</h1>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {/* Wallet Connection */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Wallet Connection*
            </label>
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            disabled={isLoading}
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-sm hover:border-[#3B5AA8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Wallet className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-700">Connect Wallet</span>
                          </button>
                        );
                      }

                      return (
                        <div className="border border-gray-300 rounded-sm p-3 flex items-center justify-between bg-gray-50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-700 font-medium">
                              {account.displayName}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {chain.name}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Type*
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.type
                        ? 'border-red-500 focus:ring-red-500/20'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">
                      <div className="flex items-center gap-2">
                        <span>Academic</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Certification">
                      <div className="flex items-center gap-2">
                        <span>Certification</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Name*
            </label>
            <Input
              {...control.register('name')}
              disabled={isLoading}
              placeholder="e.g., Dean's List Award"
              className={errors.name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Issuing Institution */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Issuing Institution*
            </label>
            <div className="relative">
              <Input
                {...control.register('institution')}
                disabled={isLoading}
                placeholder="e.g., University of the Philippines"
                className={errors.institution ? 'border-red-500 focus-visible:ring-red-500/20' : ''}
              />
              {errors.institution && <p className="mt-1 text-xs text-red-500">{errors.institution.message}</p>}
            </div>
          </div>

          {/* Issued Date */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Issued Date 
            </label>
            <Controller
              name="issuedDate"
              control={control}
              render={({ field }) => {
                const dateValue = field.value ? new Date(field.value) : undefined;
                
                const currentYear = dateValue ? dateValue.getFullYear() : undefined;
                const currentMonth = dateValue ? dateValue.getMonth() : undefined;

                const handleYearChange = (yearStr: string) => {
                  if (!yearStr) return;
                  const year = parseInt(yearStr);
                  const month = currentMonth !== undefined ? currentMonth : 0;
                  const newDate = new Date(year, month, 1);
                  field.onChange(format(newDate, 'yyyy-MM-dd'));
                };

                const handleMonthChange = (monthStr: string) => {
                  if (!monthStr) return;
                  const month = parseInt(monthStr);
                  const year = currentYear || new Date().getFullYear();
                  const newDate = new Date(year, month, 1);
                  field.onChange(format(newDate, 'yyyy-MM-dd'));
                };

                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        disabled={isLoading}
                        variant="outline"
                        className={`w-full justify-start cursor-pointer rounded-sm hover:bg-secondary/3 ${
                          dateValue ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {dateValue ? format(dateValue, 'MMMM yyyy') : 'Select month and year'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <div className="flex gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Month</label>
                          <select
                            className="flex h-9 w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={currentMonth !== undefined ? currentMonth : ''}
                            onChange={(e) => handleMonthChange(e.target.value)}
                          >
                            <option value="" disabled>Select</option>
                            {MONTHS.map((month, index) => (
                              <option key={month} value={index}>
                                {month}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Year</label>
                          <select
                            className="flex h-9 w-[100px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={currentYear || ''}
                            onChange={(e) => handleYearChange(e.target.value)}
                          >
                            <option value="" disabled>Select</option>
                            {YEARS.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {field.value && (
                        <Button
                          variant="ghost"
                          className="w-full mt-4 h-8 text-xs border border-border bg-card hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => field.onChange('')}
                        >
                          Clear choice
                        </Button>
                      )}
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Update Document/Image (Optional)
            </label>
            
            {!file && !preview ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-sm p-18 text-center hover:border-[#3B5AA8] transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload new file
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {file ? file.name : 'Current Document'}
                    </p>
                    {file && (
                      <p className="text-[11px] text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={removeFile}
                    disabled={isLoading}
                    variant="ghost"
                    size="icon-sm"
                    className='cursor-pointer'
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>
                
                {/* Preview */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Preview</p>
                  {isGeneratingPreview ? (
                    <div className="w-full bg-gray-100 rounded flex items-center justify-center border border-gray-200" style={{ aspectRatio: '297/210' }}>
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        <p className="text-xs text-gray-500">Generating preview...</p>
                      </div>
                    </div>
                  ) : preview ? (
                    <div className="w-full" style={{ aspectRatio: '297/210' }}>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain bg-gray-50 rounded border border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="w-full bg-gray-100 rounded flex items-center justify-center border border-gray-200" style={{ aspectRatio: '297/210' }}>
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!file && preview && (
               <label className="block mt-2">
               <div className="border border-gray-200 rounded-sm p-3 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                 <p className="text-xs text-[#3B5AA8] font-medium">
                   Replace Document
                 </p>
               </div>
               <input
                 type="file"
                 accept="image/*,.pdf"
                 onChange={handleFileChange}
                 disabled={isLoading}
                 className="hidden"
               />
             </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-gray-50 rounded-b-sm border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            disabled={isLoading || !isConnected}
            className="flex-1 bg-[#3B5AA8] cursor-pointer hover:bg-[#2f4389] disabled:bg-gray-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Updating...'}
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Success!
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}