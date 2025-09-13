// NFT Metadata Viewer Frontend Application
class NFTMetadataViewer {
    constructor() {
        this.aptos = null;
        this.account = null;
        this.network = "testnet"; // Change to "mainnet" for production
        this.moduleAddress = "0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60";
        this.mockMode = false;
        
        // Initialize immediately - SDK should be loaded by now
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing NFT Metadata Viewer...');
            
            // Check if Aptos SDK is available
            if (typeof Aptos === 'undefined') {
                console.log('⚠️ Aptos SDK not found, enabling mock mode...');
                this.enableMockMode();
            } else {
                console.log('✅ Aptos SDK found, initializing...');
                // Initialize Aptos SDK with proper configuration
                this.aptos = new Aptos({
                    network: this.network === "testnet" ? "testnet" : "mainnet"
                });
                console.log('✅ Aptos SDK initialized successfully');
            }
            
            this.setupEventListeners();
            this.updateUI();
            console.log('🎉 Application initialized successfully');
        } catch (error) {
            console.error("❌ Failed to initialize:", error);
            this.showError("Failed to initialize application: " + error.message);
        }
    }

    enableMockMode() {
        console.log('🎭 Enabling mock mode for NFT Metadata Viewer...');
        this.mockMode = true;
        this.aptos = this.createMockAptos();
    }

    createMockAptos() {
        return {
            connect: async function() {
                console.log('🎭 Mock wallet connection');
                this.account = { 
                    address: '0x' + Math.random().toString(16).substr(2, 40),
                    publicKey: '0x' + Math.random().toString(16).substr(2, 64)
                };
                return Promise.resolve();
            },
            disconnect: async function() {
                console.log('🎭 Mock wallet disconnection');
                this.account = null;
                return Promise.resolve();
            },
            signAndSubmitTransaction: async function(tx) {
                console.log('🎭 Mock transaction:', tx);
                return { 
                    hash: 'mock_tx_' + Math.random().toString(16).substr(2, 8),
                    success: true
                };
            },
            waitForTransaction: async function() {
                console.log('🎭 Mock transaction wait');
                return Promise.resolve();
            },
            view: async function(payload) {
                console.log('🎭 Mock view call:', payload);
                return ['MockNFT_' + Math.random().toString(16).substr(2, 4), 'https://mock.com/metadata.json'];
            },
            account: null
        };
    }

    setupEventListeners() {
        // Wallet connection
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
        document.getElementById('disconnectWallet').addEventListener('click', () => this.disconnectWallet());
        
        // Create NFT metadata form
        document.getElementById('createForm').addEventListener('submit', (e) => this.handleCreateNFT(e));
        
        // View NFT metadata
        document.getElementById('fetchMetadata').addEventListener('click', () => this.fetchNFTMetadata());
        document.getElementById('useMyAddress').addEventListener('click', () => this.useMyAddress());
    }

    async connectWallet() {
        try {
            this.showLoading("Connecting wallet...");
            
            if (this.mockMode) {
                console.log('🎭 Using mock wallet connection');
                await this.aptos.connect();
                this.account = this.aptos.account;
                this.updateUI();
                this.hideLoading();
                this.showSuccess("Mock wallet connected successfully! 🎭");
                return;
            }

            if (!this.aptos) {
                this.aptos = new Aptos();
            }
            
            // Check if wallet is available
            if (typeof window.aptos === 'undefined' && typeof window.martian === 'undefined') {
                throw new Error("No Aptos wallet detected. Please install Petra or Martian wallet extension.");
            }
            
            await this.aptos.connect();
            this.account = this.aptos.account;
            
            this.updateUI();
            this.hideLoading();
            this.showSuccess("Wallet connected successfully!");
        } catch (error) {
            console.error("Wallet connection failed:", error);
            this.hideLoading();
            this.showError("Failed to connect wallet: " + error.message);
        }
    }

    async disconnectWallet() {
        try {
            await this.aptos.disconnect();
            this.account = null;
            this.updateUI();
            this.showSuccess("Wallet disconnected");
        } catch (error) {
            console.error("Wallet disconnection failed:", error);
            this.showError("Failed to disconnect wallet");
        }
    }

    async handleCreateNFT(event) {
        event.preventDefault();
        
        if (!this.account) {
            this.showError("Please connect your wallet first");
            return;
        }

        const name = document.getElementById('nftName').value.trim();
        const uri = document.getElementById('nftUri').value.trim();

        if (!name || !uri) {
            this.showError("Please fill in all fields");
            return;
        }

        try {
            this.showLoading("Creating NFT metadata...");
            
            const transaction = {
                type: "entry_function_payload",
                function: `${this.moduleAddress}::NFTMetadataViewer::create_nft_metadata`,
                arguments: [name, uri],
                type_arguments: []
            };

            const response = await this.aptos.signAndSubmitTransaction(transaction);
            await this.aptos.waitForTransaction({ transactionHash: response.hash });
            
            this.hideLoading();
            this.showSuccess(`NFT metadata created successfully! Transaction: ${response.hash}`);
            
            // Clear form
            document.getElementById('createForm').reset();
            
        } catch (error) {
            console.error("Failed to create NFT metadata:", error);
            this.hideLoading();
            this.showError("Failed to create NFT metadata: " + error.message);
        }
    }

    async fetchNFTMetadata() {
        const addressInput = document.getElementById('accountAddress').value.trim();
        
        if (!addressInput) {
            this.showError("Please enter an account address");
            return;
        }

        try {
            this.showLoading("Fetching NFT metadata...");
            
            const response = await this.aptos.view({
                payload: {
                    function: `${this.moduleAddress}::NFTMetadataViewer::get_nft_metadata`,
                    arguments: [addressInput],
                    type_arguments: []
                }
            });

            if (response && response.length >= 2) {
                const [name, uri] = response;
                this.displayMetadata(name, uri, addressInput);
                this.hideLoading();
            } else {
                throw new Error("Invalid response format");
            }
            
        } catch (error) {
            console.error("Failed to fetch NFT metadata:", error);
            this.hideLoading();
            
            if (error.message.includes("E_NFT_NOT_FOUND") || error.message.includes("not found")) {
                this.showError("No NFT metadata found for this account address");
            } else {
                this.showError("Failed to fetch NFT metadata: " + error.message);
            }
        }
    }

    displayMetadata(name, uri, account) {
        document.getElementById('metadataName').textContent = name;
        document.getElementById('metadataUri').textContent = uri;
        document.getElementById('metadataAccount').textContent = account;
        document.getElementById('metadataResult').style.display = 'block';
    }

    useMyAddress() {
        if (this.account) {
            document.getElementById('accountAddress').value = this.account.address;
        } else {
            this.showError("Please connect your wallet first");
        }
    }

    updateUI() {
        const connectBtn = document.getElementById('connectWallet');
        const disconnectBtn = document.getElementById('disconnectWallet');
        const walletInfo = document.getElementById('walletInfo');
        const walletAddress = document.getElementById('walletAddress');
        const networkInfo = document.getElementById('networkInfo');

        if (this.account) {
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-block';
            walletInfo.style.display = 'block';
            walletAddress.textContent = this.account.address;
            networkInfo.textContent = this.network;
        } else {
            connectBtn.style.display = 'inline-block';
            disconnectBtn.style.display = 'none';
            walletInfo.style.display = 'none';
        }
    }

    showLoading(message = "Loading...") {
        const loading = document.getElementById('loadingIndicator');
        loading.querySelector('p').textContent = message;
        loading.style.display = 'block';
        this.hideMessages();
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        this.hideMessages(['errorMessage']);
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        successText.textContent = message;
        successDiv.style.display = 'block';
        this.hideMessages(['successMessage']);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }

    hideMessages(except = []) {
        const messages = ['errorMessage', 'successMessage'];
        messages.forEach(id => {
            if (!except.includes(id)) {
                document.getElementById(id).style.display = 'none';
            }
        });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NFTMetadataViewer();
});
