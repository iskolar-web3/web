import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { getContractAddress, NFT_CREDENTIAL_ABI, type CredentialData } from '@/lib/contracts';
import { useMemo, useEffect } from 'react';
import { storeCredentialTxHash } from '@/utils/txHashStorage.utils';
import { decodeEventLog } from 'viem';
import { logger } from '@/lib/logger';

/**
 * Hook to get contract address for current chain
 */
export function useContractAddress() {
  const chainId = useChainId();
  return useMemo(() => getContractAddress(chainId), [chainId]);
}

/**
 * Hook to issue a credential
 */
export function useIssueCredential() {
  const contractAddress = useContractAddress();
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Store transaction hash with tokenId and chainId when transaction succeeds
  useEffect(() => {
    if (isSuccess && hash && receipt && contractAddress) {
      try {
        const eventAbi = NFT_CREDENTIAL_ABI.find(
          (item) => item.type === 'event' && item.name === 'CredentialIssued'
        ) as any;

        if (eventAbi && receipt.logs) {
          for (const log of receipt.logs) {
            if (log.address.toLowerCase() === contractAddress.toLowerCase()) {
              try {
                const decoded = decodeEventLog({
                  abi: [eventAbi],
                  data: log.data,
                  topics: log.topics,
                }) as { eventName: string; args: { tokenId?: bigint } };

                if (decoded.eventName === 'CredentialIssued' && decoded.args.tokenId) {
                  const tokenId = decoded.args.tokenId as bigint;
                  storeCredentialTxHash(tokenId, hash, chainId);
                  break;
                }
              } catch (e) {
                continue;
              }
            }
          }
        }
      } catch (error) {
        logger.error('Failed to extract tokenId from transaction receipt:', error);
      }
    }
  }, [isSuccess, hash, receipt, contractAddress, chainId]);

  const issueCredential = async (
    recipient: `0x${string}`,
    credentialType: string,
    credentialName: string,
    issuingInstitution: string,
    issuedDate: string,
    documentURI: string,
    tokenURI: string,
  ) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain. Please switch to a supported network (Hardhat or Sepolia).');
    }

    return writeContract({
      address: contractAddress,
      abi: NFT_CREDENTIAL_ABI,
      functionName: 'issueCredential',
      args: [
        recipient,
        credentialType,
        credentialName,
        issuingInstitution,
        issuedDate,
        documentURI,
        tokenURI,
      ],
    });
  };

  return {
    issueCredential,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to update an existing credential
 */
export function useUpdateCredential() {
  const contractAddress = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const updateCredential = async (
    tokenId: bigint,
    credentialType: string,
    credentialName: string,
    issuingInstitution: string,
    issuedDate: string,
    documentURI: string,
    tokenURI: string,
  ) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain. Please switch to a supported network (Hardhat or Sepolia).');
    }

    return writeContract({
      address: contractAddress,
      abi: NFT_CREDENTIAL_ABI,
      functionName: 'updateCredential',
      args: [
        tokenId,
        credentialType,
        credentialName,
        issuingInstitution,
        issuedDate,
        documentURI,
        tokenURI,
      ],
    });
  };

  return {
    updateCredential,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to revoke an existing credential
 */
export function useRevokeCredential() {
  const contractAddress = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const revokeCredential = async (
    tokenId: bigint,
    reason: string,
  ) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain. Please switch to a supported network (Hardhat or Sepolia).');
    }

    return writeContract({
      address: contractAddress,
      abi: NFT_CREDENTIAL_ABI,
      functionName: 'revokeCredential',
      args: [
        tokenId,
        reason,
      ],
    });
  };

  return {
    revokeCredential,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to read a credential by token ID
 */
export function useCredential(tokenId: bigint | undefined) {
  const contractAddress = useContractAddress();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: NFT_CREDENTIAL_ABI,
    functionName: 'getCredential',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && contractAddress !== undefined,
    },
  });

  return {
    credential: data as CredentialData | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook to check if credential is valid
 */
export function useCredentialValid(tokenId: bigint | undefined) {
  const contractAddress = useContractAddress();
  
  const { data, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: NFT_CREDENTIAL_ABI,
    functionName: 'isCredentialValid',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && contractAddress !== undefined,
    },
  });

  return {
    isValid: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to get credentials by holder address
 */
export function useCredentialsByHolder(
  holderAddress: `0x${string}` | undefined,
  offset = 0,
  limit = 15
) {
  const contractAddress = useContractAddress();
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: NFT_CREDENTIAL_ABI,
    functionName: 'getCredentialsByHolder',
    args: holderAddress && contractAddress
      ? [holderAddress, BigInt(offset), BigInt(limit)]
      : undefined,
    query: {
      enabled: holderAddress !== undefined && contractAddress !== undefined,
      retry: 1,
    },
  });

  // Handle empty array case - when function returns empty array, data might be undefined
  // but we want to treat it as an empty array
  const tokenIds = data !== undefined ? (data as bigint[]) : (error?.message?.includes('returned no data') ? [] : undefined);

  return {
    tokenIds,
    isLoading,
    error: error?.message?.includes('returned no data') && data === undefined ? undefined : error,
    refetch,
  };
}

/**
 * Hook to get token URI for a credential
 */
export function useTokenURI(tokenId: bigint | undefined) {
  const contractAddress = useContractAddress();
  
  const { data, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: NFT_CREDENTIAL_ABI,
    functionName: 'tokenURI',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined && contractAddress !== undefined,
    },
  });

  return {
    tokenURI: data as string | undefined,
    isLoading,
    error,
  };
}