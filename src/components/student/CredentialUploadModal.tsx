import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Upload, FileText, Award, X, CheckCircle, Loader2, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useIssueCredential } from '@/hooks/useNFTCredential';
import { format } from 'date-fns';
import { uploadToIPFS, uploadMetadataToIPFS, getIPFSUri } from '@/utils/ipfs.utils';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

interface CredentialUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  type: string;
  name: string;
  institution: string;
  issuedDate: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
const PDFJS_VERSION = '3.11.174';

export default function CredentialUploadModal({ isOpen, onClose, onSuccess }: CredentialUploadModalProps) {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    name: '',
    institution: '',
    issuedDate: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const pdfjsLoadedRef = useRef(false);
  
  const { address, isConnected } = useAccount();
  const { issueCredential, isPending, isConfirming, isSuccess, error: contractError } = useIssueCredential();

  /**
   * Loads PDF.js library if not already loaded
   */
  useEffect(() => {
    if (pdfjsLoadedRef.current) return;

    const loadPDFJS = async () => {
      if ((window as any).pdfjsLib) {
        pdfjsLoadedRef.current = true;
        return;
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
        script.onload = () => {
          const pdfjsLib = (window as any).pdfjsLib;
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;
          pdfjsLoadedRef.current = true;
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js'));
        document.head.appendChild(script);
      });
    };

    if (isOpen) {
      loadPDFJS().catch((err) => {
        const handled = handleError(err, 'Failed to load PDF.js library');
        logger.error('PDF.js loading error:', handled.raw);
      });
    }
  }, [isOpen]);

  /**
   * Validates file type and size
   */
  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload PNG, JPG, or PDF files only.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return null;
  }, []);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  /**
   * Generates a preview image from a PDF file
   */
  const generatePDFPreview = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result as ArrayBuffer);
          const pdfjsLib = (window as any).pdfjsLib;
          
          if (!pdfjsLib) {
            reject(new Error('PDF.js library not loaded'));
            return;
          }
          
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          const page = await pdf.getPage(1);
          
          const scale = 2;
          const viewport = page.getViewport({ scale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          resolve(canvas.toDataURL());
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = () => reject(new Error('Failed to read file'));
      fileReader.readAsArrayBuffer(file);
    });
  }, []);

  /**
   * Handles file selection and validation
   */
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      e.target.value = ''; // Reset input
      return;
    }

    setFile(selectedFile);
    setPreview(null);
    setError(null);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type === 'application/pdf') {
      setIsGeneratingPreview(true);
      try {
        // Wait for PDF.js to be loaded
        if (!pdfjsLoadedRef.current) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        const pdfPreview = await generatePDFPreview(selectedFile);
        setPreview(pdfPreview);
      } catch (error) {
        const handled = handleError(error, 'Failed to generate PDF preview. Please try again.');
        logger.error('Failed to generate PDF preview:', handled.raw);
        setError(handled.message);
        setPreview(null);
      } finally {
        setIsGeneratingPreview(false);
      }
    }
  }, [validateFile, generatePDFPreview]);

  const removeFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ type: '', name: '', institution: '', issuedDate: '' });
    setFile(null);
    setPreview(null);
    setError(null);
    setUploadSuccess(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.type || !formData.name || !formData.institution || !file) {
      setError('Please fill in all required fields and upload a file');
      return;
    }

    if (!isConnected || !address) {
      setError('Please connect your wallet to upload credentials');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      // Upload document file to IPFS
      setError('Uploading document to IPFS...');
      const documentUpload = await uploadToIPFS(file, file.name);
      
      if (!documentUpload.success || !documentUpload.ipfsHash) {
        throw new Error(documentUpload.error || 'Failed to upload document to IPFS');
      }

      const documentURI = getIPFSUri(documentUpload.ipfsHash);

      // Format date as YYYY-MM
      const formattedDate = formData.issuedDate 
        ? format(new Date(formData.issuedDate), 'yyyy-MM')
        : '';

      // Create metadata object
      const metadata = {
        name: formData.name,
        description: `${formData.type} credential issued by ${formData.institution}`,
        image: documentURI, // Use document URI as the image
        attributes: [
          {
            trait_type: 'Type',
            value: formData.type,
          },
          {
            trait_type: 'Issuing Institution',
            value: formData.institution,
          },
          {
            trait_type: 'Issued Date',
            value: formattedDate || 'Not specified',
          },
        ],
        properties: {
          credentialType: formData.type,
          credentialName: formData.name,
          issuingInstitution: formData.institution,
          issuedDate: formattedDate,
          documentURI: documentURI,
        },
      };

      // Upload metadata to IPFS
      setError('Uploading metadata to IPFS...');
      const metadataUpload = await uploadMetadataToIPFS(metadata, `credential-${Date.now()}.json`);
      
      if (!metadataUpload.success || !metadataUpload.ipfsHash) {
        throw new Error(metadataUpload.error || 'Failed to upload metadata to IPFS');
      }

      const tokenURI = getIPFSUri(metadataUpload.ipfsHash);

      // Issue credential on-chain
      await issueCredential(
        address, 
        formData.type,
        formData.name,
        formData.institution,
        formattedDate,
        documentURI,
        tokenURI,
      );
    } catch (err) {
      const handled = handleError(err, 'Failed to upload credential. Please try again.');
      logger.error('Error issuing credential:', handled.raw);
      setError(handled.message);
      setIsUploading(false);
    }
  }, [formData, file, isConnected, address, issueCredential]);

  // Watch for transaction success
  useEffect(() => {
    if (isSuccess) {
      setUploadSuccess(true);
      setIsUploading(false);
      setTimeout(() => {
        resetForm();
        onSuccess?.();
        onClose();
      }, 1500);
    }
  }, [isSuccess, resetForm, onSuccess, onClose]);

  // Watch for contract errors
  useEffect(() => {
    if (contractError) {
      setError(contractError.message || 'Transaction failed');
      setIsUploading(false);
    }
  }, [contractError]);

  const handleClose = useCallback(() => {
    const isLoading = isPending || isConfirming || isUploading;
    if (!isLoading) {
      resetForm();
      onClose();
    }
  }, [isPending, isConfirming, isUploading, resetForm, onClose]);

  /**
   * Format file size for display
   */
  const formatFileSize = useCallback((bytes: number): string => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }, []);

  /**
   * Format date for display
   */
  const formattedDate = useMemo(() => {
    if (!formData.issuedDate) return null;
    return new Date(formData.issuedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }, [formData.issuedDate]);

  const isLoading = isPending || isConfirming || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl max-h-[90vh] flex flex-col p-0" showCloseButton={!isLoading}>
        <DialogHeader className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg text-gray-900">Add credential</h1>
            
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="px-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <X className="w-5 h-5 text-red-700 flex-shrink-0" />
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Wallet Connection Section */}
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

          {/* Credential Type */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Type*
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Academic', 'Certification'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange('type', type)}
                  disabled={isLoading}
                  className={`p-4 cursor-pointer rounded-sm border-2 transition-all disabled:opacity-50 ${
                    formData.type === type
                      ? 'border-secondary bg-secondary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {type === 'Academic' ? (
                      <Award className="w-4 h-4 text-[#3B5AA8]" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#3B5AA8]" />
                    )}
                    <span className="text-sm text-gray-900">{type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Credential Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Name*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              placeholder="e.g., Dean's List Award"
              className="w-full px-3 py-2 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Issuing Institution */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Issuing Institution*
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                disabled={isLoading}
                placeholder="e.g., University of the Philippines"
                className="w-full px-3 py-2 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Issued Date */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Issued Date 
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={isLoading}
                  variant="outline"
                  className={`w-full justify-start cursor-pointer rounded-sm hover:bg-secondary/3 ${
                    formData.issuedDate ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {formattedDate || 'Select month and year'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-2">
                  <div className="space-y-2">
                    <label className="text-xs">Year</label>
                    <select
                      value={formData.issuedDate ? new Date(formData.issuedDate).getFullYear() : ''}
                      onChange={(e) => {
                        const year = e.target.value;
                        const month = formData.issuedDate ? new Date(formData.issuedDate).getMonth() : 0;
                        if (year) {
                          const date = new Date(parseInt(year), month, 1);
                          handleInputChange('issuedDate', date.toISOString().split('T')[0]);
                        }
                      }}
                      className="w-full px-3 py-2 cursor-pointer text-xs rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">Select year</option>
                      {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs">Month</label>
                    <select
                      value={formData.issuedDate ? new Date(formData.issuedDate).getMonth() : ''}
                      onChange={(e) => {
                        const month = parseInt(e.target.value);
                        const year = formData.issuedDate ? new Date(formData.issuedDate).getFullYear() : new Date().getFullYear();
                        if (!isNaN(month) && year) {
                          const date = new Date(year, month, 1);
                          handleInputChange('issuedDate', date.toISOString().split('T')[0]);
                        }
                      }}
                      className="w-full px-3 py-2 cursor-pointer text-xs rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">Select month</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.issuedDate && (
                    <Button
                      onClick={() => handleInputChange('issuedDate', '')}
                      variant="outline"
                      className="w-full mt-1 text-xs rounded-sm hover:bg-secondary/3 cursor-pointer"
                      size="sm"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">
              Upload Document/Image*
            </label>
            
            {!file ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-sm p-18 text-center hover:border-[#3B5AA8] transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload or drag and drop
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
                      {file.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
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
                
                {/* A4 Landscape Preview */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Thumbnail</p>
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
          </div>

          {/* Info Card */}
          <div className="bg-[#F9FAFB] border border-[#E0ECFF] rounded-sm p-3">
            <div className="flex gap-3">
              <div>
                <h3 className="text-sm text-primary mb-1">
                  About NFT Credentials
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your credential will be securely stored on-chain in a trusted digital system, ensuring it stays authentic and tamper-proof.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-gray-50 rounded-b-sm border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0">
          <Button
            onClick={resetForm}
            disabled={isLoading}
            variant="outline"
            className="flex-1 cursor-pointer"
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isConnected}
            className="flex-1 bg-[#3B5AA8] cursor-pointer hover:bg-[#2f4389] disabled:bg-gray-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isConfirming ? 'Confirming...' : 'Uploading...'}
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Success!
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}