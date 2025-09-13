import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Configuration for the Aptos client
const config = new AptosConfig({ 
  network: Network.TESTNET 
});

export const aptosClient = new Aptos(config);

// Smart contract configuration
export const MODULE_ADDRESS = "0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60";
export const MODULE_NAME = "NFTMetadataViewer";

// Helper function to check if wallet is installed
export const isWalletInstalled = () => {
  return typeof window !== "undefined" && window.aptos;
};

// Helper function to connect wallet
export const connectWallet = async () => {
  if (!isWalletInstalled()) {
    throw new Error("Aptos wallet not installed");
  }
  
  try {
    const response = await window.aptos.connect();
    return response.address;
  } catch (error) {
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

// Helper function to disconnect wallet
export const disconnectWallet = async () => {
  if (!isWalletInstalled()) {
    return;
  }
  
  try {
    await window.aptos.disconnect();
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
  }
};

// Helper function to get current wallet address
export const getCurrentWalletAddress = async (): Promise<string> => {
  if (!isWalletInstalled()) {
    throw new Error("Aptos wallet not installed");
  }

  try {
    // Try the modern approach first
    const account = await window.aptos.account();
    if (account?.address) {
      return account.address;
    }
  } catch (error) {
    // Fall back to legacy approach
    if (window.aptos.account?.address) {
      return window.aptos.account.address;
    }
  }

  throw new Error("Wallet not connected. Please connect your wallet first.");
};

// Helper function to get account info
export const getAccountInfo = async (address: string) => {
  try {
    const account = await aptosClient.getAccountInfo({ accountAddress: address });
    return account;
  } catch (error) {
    throw new Error(`Failed to get account info: ${error.message}`);
  }
};

// Helper function to create NFT metadata
export const createNFTMetadata = async (name: string, uri: string) => {
  if (!isWalletInstalled()) {
    throw new Error("Aptos wallet not installed");
  }

  try {
    // Get the current wallet address using our robust helper
    const sender = await getCurrentWalletAddress();
    console.log("Using sender address:", sender);

    // Use the direct transaction payload approach
    const transactionPayload = {
      type: "entry_function_payload",
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::create_nft_metadata`,
      type_arguments: [],
      arguments: [name, uri],
    };

    console.log("Transaction payload:", transactionPayload);

    // Sign and submit the transaction
    const committedTransaction = await window.aptos.signAndSubmitTransaction(transactionPayload);
    
    console.log("Transaction submitted:", committedTransaction);

    // Wait for transaction to be processed
    const result = await aptosClient.waitForTransaction({
      transactionHash: committedTransaction.hash,
    });

    return result;
  } catch (error: any) {
    console.error("Create NFT metadata error:", error);
    throw new Error(`Failed to create NFT metadata: ${error.message}`);
  }
};

// Helper function to get NFT metadata
export const getNFTMetadata = async (accountAddress: string) => {
  try {
    // Since get_nft_metadata is a public fun, we need to use a different approach
    // We'll use the account resources API to get the NFTMetadata resource directly
    const accountResources = await aptosClient.getAccountResources({
      accountAddress: accountAddress,
    });

    // Look for the NFTMetadata resource
    const nftMetadataResource = accountResources.find(
      (resource) => resource.type === `${MODULE_ADDRESS}::${MODULE_NAME}::NFTMetadata`
    );

    if (!nftMetadataResource) {
      throw new Error("NFT metadata not found for this account");
    }

    // Extract the data from the resource
    const data = nftMetadataResource.data as any;
    
    return {
      name: data.name,
      uri: data.uri,
    };
  } catch (error: any) {
    if (error.message.includes("Account not found")) {
      throw new Error("Account not found");
    }
    if (error.message.includes("NFT metadata not found")) {
      throw new Error("NFT metadata not found for this account");
    }
    throw new Error(`Failed to get NFT metadata: ${error.message}`);
  }
};

// Declare window.aptos for TypeScript
declare global {
  interface Window {
    aptos: any;
  }
}
