import { logger } from '@/lib/logger';

const STORAGE_KEY_PREFIX = 'credential_tx_hash_';
const STORAGE_CHAIN_PREFIX = 'credential_chain_';

/**
 * Store transaction hash and chainId for a credential tokenId
 */
export function storeCredentialTxHash(tokenId: bigint, txHash: `0x${string}`, chainId: number): void {
  try {
    const hashKey = `${STORAGE_KEY_PREFIX}${tokenId.toString()}`;
    const chainKey = `${STORAGE_CHAIN_PREFIX}${tokenId.toString()}`;
    localStorage.setItem(hashKey, txHash);
    localStorage.setItem(chainKey, chainId.toString());
  } catch (error) {
    logger.error('Failed to store transaction hash:', error);
  }
}

/**
 * Retrieve transaction hash for a credential tokenId
 */
export function getCredentialTxHash(tokenId: bigint): `0x${string}` | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${tokenId.toString()}`;
    const hash = localStorage.getItem(key);
    return hash as `0x${string}` | null;
  } catch (error) {
    logger.error('Failed to retrieve transaction hash:', error);
    return null;
  }
}

/**
 * Retrieve chainId for a credential tokenId
 */
export function getCredentialChainId(tokenId: bigint): number | null {
  try {
    const key = `${STORAGE_CHAIN_PREFIX}${tokenId.toString()}`;
    const chainIdStr = localStorage.getItem(key);
    return chainIdStr ? parseInt(chainIdStr, 10) : null;
  } catch (error) {
    logger.error('Failed to retrieve chain ID:', error);
    return null;
  }
}

/**
 * Get network name from chainId
 */
export function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 11155111:
      return 'Sepolia';
    case 31337:
      return 'Hardhat Local';
    case 80002:
      return 'Polygon Amoy';
    case 137:
      return 'Polygon';
    default:
      return `Chain ${chainId}`;
  }
}

/**
 * Get block explorer URL for a transaction hash based on chain ID
 */
export function getExplorerTxUrl(chainId: number, txHash: `0x${string}`): string | null {
  switch (chainId) {
    case 1: // Ethereum Mainnet
      return `https://etherscan.io/tx/${txHash}`;
    case 11155111: // Sepolia
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case 31337: // Hardhat localhost
      return `http://localhost:8545/tx/${txHash}`;
    case 80002: // Polygon Amoy
      return `https://amoy.polygonscan.com/tx/${txHash}`;
    case 137: // Polygon Mainnet
      return `https://polygonscan.com/tx/${txHash}`;
    default:
      return null;
  }
}