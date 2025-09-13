import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, isWalletInstalled } from '../utils/aptos';

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isWalletInstalled()) {
        try {
          // Try the modern approach first
          const account = await window.aptos.account();
          if (account?.address) {
            setAccount(account.address);
            setIsConnected(true);
            return;
          }
        } catch (error) {
          // Fall back to legacy approach
          if (window.aptos.account?.address) {
            setAccount(window.aptos.account.address);
            setIsConnected(true);
            return;
          }
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (isWalletInstalled()) {
      const handleAccountChange = (newAccount: any) => {
        if (newAccount?.address) {
          setAccount(newAccount.address);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      };

      // Try to set up account change listener
      try {
        window.aptos.onAccountChange(handleAccountChange);
      } catch (error) {
        console.log("Account change listener not available");
      }
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const address = await connectWallet();
      setAccount(address);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setAccount(null);
      setIsConnected(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    account,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    isWalletInstalled: isWalletInstalled(),
  };
};
