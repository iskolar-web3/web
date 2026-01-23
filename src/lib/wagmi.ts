import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, polygonAmoy, polygon } from 'wagmi/chains';
import { defineChain } from 'viem';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '';

if (!projectId && import.meta.env.DEV) {
  console.warn(
    'VITE_WALLET_CONNECT_PROJECT_ID is not set. WalletConnect features may not work properly. ' +
    'Get a project ID from https://cloud.walletconnect.com'
  );
}

// Custom Hardhat chain configuration
const hardhat = defineChain({
  id: 31337,
  name: 'Hardhat Localhost',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
});

export const config = getDefaultConfig({
  appName: 'Iskolar',
  projectId: projectId || 'YOUR_PROJECT_ID',
  chains: [polygon, polygonAmoy, sepolia, hardhat],
  ssr: false,
});