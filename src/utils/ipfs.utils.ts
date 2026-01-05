import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'https://gateway.pinata.cloud';

/**
 * Upload a file to Pinata IPFS
 * @param file - File to upload
 * @param fileName - Optional custom file name
 * @returns Promise resolving to IPFS hash (CID) or error
 */
export async function uploadToIPFS(
  file: File,
  fileName?: string
): Promise<{ success: boolean; ipfsHash?: string; error?: string }> {
  if (!PINATA_JWT) {
    const error = 'PINATA_JWT is not configured';
    logger.error(error);
    return { success: false, error };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Pinata metadata
    const pinataMetadata = JSON.stringify({
      name: fileName || file.name,
    });

    formData.append('pinataMetadata', pinataMetadata);

    // Pinata options
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });

    formData.append('pinataOptions', pinataOptions);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      logger.error('Pinata upload error:', errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    const ipfsHash = data.IpfsHash;

    if (!ipfsHash) {
      const error = 'No IPFS hash returned from Pinata';
      logger.error(error);
      return { success: false, error };
    }

    return { success: true, ipfsHash };
  } catch (error) {
    const handled = handleError(error, 'Failed to upload file to IPFS');
    logger.error('IPFS upload error:', handled.raw);
    return { success: false, error: handled.message };
  }
}

/**
 * Upload JSON metadata to Pinata IPFS
 * @param metadata - Metadata object to upload
 * @param fileName - Name for the metadata file
 * @returns Promise resolving to IPFS hash (CID) or error
 */
export async function uploadMetadataToIPFS(
  metadata: Record<string, unknown>,
  fileName = 'metadata.json'
): Promise<{ success: boolean; ipfsHash?: string; error?: string }> {
  if (!PINATA_JWT) {
    const error = 'PINATA_JWT is not configured';
    logger.error(error);
    return { success: false, error };
  }

  try {
    const jsonString = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], fileName, { type: 'application/json' });

    const formData = new FormData();
    formData.append('file', file);

    // Pinata metadata
    const pinataMetadata = JSON.stringify({
      name: fileName,
    });

    formData.append('pinataMetadata', pinataMetadata);

    // Pinata options
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });

    formData.append('pinataOptions', pinataOptions);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
      logger.error('Pinata metadata upload error:', errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    const ipfsHash = data.IpfsHash;

    if (!ipfsHash) {
      const error = 'No IPFS hash returned from Pinata';
      logger.error(error);
      return { success: false, error };
    }

    return { success: true, ipfsHash };
  } catch (error) {
    const handled = handleError(error, 'Failed to upload metadata to IPFS');
    logger.error('IPFS metadata upload error:', handled.raw);
    return { success: false, error: handled.message };
  }
}

/**
 * Get IPFS gateway URL from hash
 * @param ipfsHash - IPFS hash (CID)
 * @returns Gateway URL
 */
export function getIPFSUrl(ipfsHash: string): string {
  const hash = ipfsHash.replace(/^ipfs:\/\//, '');
  
  const gateway = GATEWAY_URL.replace(/\/$/, '');
  return `${gateway}/${hash}`;
}

/**
 * Convert IPFS hash to ipfs:// URI format
 * @param ipfsHash - IPFS hash (CID)
 * @returns ipfs:// URI
 */
export function getIPFSUri(ipfsHash: string): string {
  const hash = ipfsHash.replace(/^ipfs:\/\//, '');
  return `ipfs://${hash}`;
}

