import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '@/lib/wagmi';
import { type ReactNode } from 'react';

interface WagmiProviderProps {
  children: ReactNode;
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <WagmiProviderBase config={config}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
    </WagmiProviderBase>
  );
}

