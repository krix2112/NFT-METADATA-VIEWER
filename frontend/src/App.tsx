import React, { useState } from 'react';
import { Wallet, Plus, Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useWallet } from './hooks/useWallet';
import { createNFTMetadata, getNFTMetadata } from './utils/aptos';

interface NFTMetadata {
  name: string;
  uri: string;
}

const App: React.FC = () => {
  const { account, isConnected, isConnecting, error, connect, disconnect, isWalletInstalled } = useWallet();
  
  // Create NFT state
  const [nftName, setNftName] = useState('');
  const [nftUri, setNftUri] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  // View NFT state
  const [viewAddress, setViewAddress] = useState('');
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const handleCreateNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftName.trim() || !nftUri.trim()) return;

    setIsCreating(true);
    setCreateError(null);
    setCreateSuccess(false);

    try {
      await createNFTMetadata(nftName.trim(), nftUri.trim());
      setCreateSuccess(true);
      setNftName('');
      setNftUri('');
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewAddress.trim()) return;

    setIsViewing(true);
    setViewError(null);
    setNftMetadata(null);

    try {
      const metadata = await getNFTMetadata(viewAddress.trim());
      setNftMetadata(metadata);
    } catch (err: any) {
      setViewError(err.message);
    } finally {
      setIsViewing(false);
    }
  };

  const useMyAddress = () => {
    if (account) {
      setViewAddress(account);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NFT Metadata Viewer</h1>
          <p className="text-blue-200">Create and view NFT metadata on Aptos blockchain</p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6 text-blue-300" />
              <div>
                <h2 className="text-xl font-semibold text-white">Wallet Connection</h2>
                <p className="text-blue-200 text-sm">
                  {isConnected ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Not connected'}
                </p>
              </div>
            </div>
            <div>
              {!isWalletInstalled ? (
                <div className="flex items-center space-x-2 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span>Wallet not installed</span>
                </div>
              ) : isConnected ? (
                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={connect}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isConnecting ? <Loader className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                  <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center space-x-2 text-red-300">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create NFT Metadata */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Plus className="w-6 h-6 text-green-300" />
              <h2 className="text-xl font-semibold text-white">Create NFT Metadata</h2>
            </div>

            <form onSubmit={handleCreateNFT} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  NFT Name
                </label>
                <input
                  type="text"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  placeholder="Enter NFT name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Metadata URI
                </label>
                <input
                  type="url"
                  value={nftUri}
                  onChange={(e) => setNftUri(e.target.value)}
                  placeholder="https://example.com/metadata.json"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!isConnected || isCreating || !nftName.trim() || !nftUri.trim()}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isCreating ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                <span>{isCreating ? 'Creating...' : 'Create NFT Metadata'}</span>
              </button>
            </form>

            {createError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center space-x-2 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span>{createError}</span>
                </div>
              </div>
            )}

            {createSuccess && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span>NFT metadata created successfully!</span>
                </div>
              </div>
            )}
          </div>

          {/* View NFT Metadata */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <Search className="w-6 h-6 text-blue-300" />
              <h2 className="text-xl font-semibold text-white">View NFT Metadata</h2>
            </div>

            <form onSubmit={handleViewNFT} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Account Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={viewAddress}
                    onChange={(e) => setViewAddress(e.target.value)}
                    placeholder="Enter account address"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {account && (
                    <button
                      type="button"
                      onClick={useMyAddress}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      My Address
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isViewing || !viewAddress.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isViewing ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span>{isViewing ? 'Fetching...' : 'Fetch Metadata'}</span>
              </button>
            </form>

            {viewError && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center space-x-2 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span>{viewError}</span>
                </div>
              </div>
            )}

            {nftMetadata && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-300 mb-3">NFT Metadata Found</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-blue-200 font-medium">Name:</span>
                    <span className="text-white ml-2">{nftMetadata.name}</span>
                  </div>
                  <div>
                    <span className="text-blue-200 font-medium">URI:</span>
                    <a
                      href={nftMetadata.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 ml-2 underline"
                    >
                      {nftMetadata.uri}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200">
          <p>Smart Contract: 0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60</p>
          <p className="text-sm">Network: Testnet</p>
        </div>
      </div>
    </div>
  );
};

export default App;
