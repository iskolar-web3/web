import NFTCredentialArtifact from '../../../contracts/artifacts/contracts/NFTCredential.sol/NFTCredential.json';

// Contract addresses for different networks
export const NFT_CREDENTIAL_ADDRESSES = {
  // Hardhat localhost network (chain ID: 31337)
  hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
  // Sepolia testnet (chain ID: 11155111)
  sepolia: '0xe117Bb3BF3a96880ac21722733EFB5c55C295460' as `0x${string}`,
} as const;

/**
 * Credential data structure returned from the contract
 */
export interface CredentialData {
  credentialType: string;
  credentialName: string;
  issuingInstitution: string;
  issuedDate: string;
  documentURI: string;
  issuer: `0x${string}`;
  issuedTimestamp: bigint;
  lastUpdatedTimestamp: bigint;
  revoked: boolean;
}

/**
 * Contract ABI - Imported from compiled artifact
 */
export const NFT_CREDENTIAL_ABI = NFTCredentialArtifact.abi;

/**
 * Get contract address for a given chain ID
 */
export function getContractAddress(chainId: number): `0x${string}` | undefined {
  switch (chainId) {
    case 31337: // Hardhat localhost
      return NFT_CREDENTIAL_ADDRESSES.hardhat;
    case 11155111: // Sepolia
      return NFT_CREDENTIAL_ADDRESSES.sepolia;
    default:
      return undefined;
  }
}
