/**
 * NFT Metadata Viewer - Test Data and Fixtures
 * This file contains comprehensive test data, mock objects, and fixtures
 * for testing the NFT Metadata Viewer application
 */

// Test Data Constants
const TEST_CONSTANTS = {
    // Module addresses for different networks
    MODULE_ADDRESSES: {
        testnet: "0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60",
        mainnet: "0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60",
        devnet: "0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60"
    },
    
    // Test account addresses
    TEST_ACCOUNTS: {
        owner: "0x1234567890abcdef1234567890abcdef12345678",
        user1: "0xabcdef1234567890abcdef1234567890abcdef12",
        user2: "0x9876543210fedcba9876543210fedcba98765432",
        notFound: "0xnotfound",
        invalid: "0xinvalid"
    },
    
    // Error codes
    ERROR_CODES: {
        NFT_NOT_FOUND: 1,
        INVALID_INPUT: 2,
        UNAUTHORIZED: 3
    }
};

// NFT Test Data
const NFT_TEST_DATA = {
    // Valid NFT metadata
    validNFTs: [
        {
            name: "TestNFT",
            uri: "https://example.com/metadata.json",
            description: "A test NFT for development"
        },
        {
            name: "ArtNFT",
            uri: "https://art.com/nft.json",
            description: "Digital art NFT"
        },
        {
            name: "GameNFT",
            uri: "https://game.com/item.json",
            description: "In-game item NFT"
        },
        {
            name: "MusicNFT",
            uri: "https://music.com/track.json",
            description: "Music track NFT"
        },
        {
            name: "CollectibleNFT",
            uri: "https://collectible.com/item.json",
            description: "Collectible item NFT"
        }
    ],
    
    // Invalid NFT metadata for testing validation
    invalidNFTs: [
        {
            name: "",
            uri: "https://example.com/metadata.json",
            description: "Empty name"
        },
        {
            name: "TestNFT",
            uri: "",
            description: "Empty URI"
        },
        {
            name: "",
            uri: "",
            description: "Both empty"
        },
        {
            name: "TestNFT",
            uri: "invalid-url",
            description: "Invalid URL"
        },
        {
            name: "TestNFT",
            uri: "ftp://example.com/metadata.json",
            description: "Non-HTTPS URL"
        }
    ],
    
    // Edge case NFT metadata
    edgeCaseNFTs: [
        {
            name: "NFT with Special Chars: !@#$%^&*()",
            uri: "https://example.com/metadata-with-special-chars.json",
            description: "Special characters in name"
        },
        {
            name: "NFT with Unicode: 🎨🚀💎",
            uri: "https://example.com/unicode-metadata.json",
            description: "Unicode characters in name"
        },
        {
            name: "Very Long NFT Name That Should Test The String Handling Capabilities Of Our Smart Contract And Frontend Application",
            uri: "https://very-long-domain-name-that-might-cause-issues.example.com/path/to/very/long/metadata/file.json",
            description: "Very long strings"
        },
        {
            name: "NFT",
            uri: "https://a.co/b.json",
            description: "Very short strings"
        }
    ]
};

// Mock Aptos SDK Objects
const MOCK_APTOS_SDK = {
    // Mock Aptos instance
    createMockAptos: function() {
        return {
            account: null,
            network: "testnet",
            
            connect: async function() {
                this.account = { 
                    address: TEST_CONSTANTS.TEST_ACCOUNTS.owner,
                    publicKey: '0xabcdef1234567890abcdef1234567890abcdef12',
                    authKey: '0x1234567890abcdef1234567890abcdef12345678'
                };
                return Promise.resolve();
            },
            
            disconnect: async function() {
                this.account = null;
                return Promise.resolve();
            },
            
            signAndSubmitTransaction: async function(tx) {
                console.log('Mock transaction:', tx);
                return { 
                    hash: 'mock_tx_' + Math.random().toString(16).substr(2, 8),
                    success: true,
                    timestamp: new Date().toISOString()
                };
            },
            
            waitForTransaction: async function(params) {
                return Promise.resolve({
                    hash: params.transactionHash,
                    success: true,
                    timestamp: new Date().toISOString()
                });
            },
            
            view: async function(payload) {
                console.log('Mock view call:', payload);
                const address = payload.arguments[0];
                
                // Return different mock data based on address
                switch (address) {
                    case TEST_CONSTANTS.TEST_ACCOUNTS.owner:
                        return ['TestNFT', 'https://example.com/metadata.json'];
                    case TEST_CONSTANTS.TEST_ACCOUNTS.user1:
                        return ['ArtNFT', 'https://art.com/nft.json'];
                    case TEST_CONSTANTS.TEST_ACCOUNTS.user2:
                        return ['GameNFT', 'https://game.com/item.json'];
                    case TEST_CONSTANTS.TEST_ACCOUNTS.notFound:
                        throw new Error('E_NFT_NOT_FOUND');
                    default:
                        return ['MockNFT_' + Math.random().toString(16).substr(2, 4), 'https://mock.com/metadata.json'];
                }
            }
        };
    },
    
    // Mock wallet objects
    createMockWallet: function(type = 'petra') {
        const wallets = {
            petra: {
                connect: async function() {
                    return {
                        address: TEST_CONSTANTS.TEST_ACCOUNTS.owner,
                        publicKey: '0xabcdef1234567890abcdef1234567890abcdef12'
                    };
                },
                disconnect: async function() {
                    return Promise.resolve();
                },
                signTransaction: async function(tx) {
                    return { hash: 'signed_tx_' + Math.random().toString(16).substr(2, 8) };
                }
            },
            martian: {
                connect: async function() {
                    return {
                        address: TEST_CONSTANTS.TEST_ACCOUNTS.user1,
                        publicKey: '0x1234567890abcdef1234567890abcdef12345678'
                    };
                },
                disconnect: async function() {
                    return Promise.resolve();
                },
                signTransaction: async function(tx) {
                    return { hash: 'martian_tx_' + Math.random().toString(16).substr(2, 8) };
                }
            }
        };
        
        return wallets[type] || wallets.petra;
    }
};

// Test Scenarios
const TEST_SCENARIOS = {
    // Happy path scenarios
    happyPath: [
        {
            name: "Successful NFT Creation",
            steps: [
                "Connect wallet",
                "Fill NFT name and URI",
                "Submit form",
                "Verify success message"
            ],
            expectedResult: "NFT metadata created successfully"
        },
        {
            name: "Successful NFT Retrieval",
            steps: [
                "Enter valid account address",
                "Click fetch metadata",
                "Verify metadata display"
            ],
            expectedResult: "NFT metadata displayed correctly"
        }
    ],
    
    // Error scenarios
    errorScenarios: [
        {
            name: "Wallet Not Connected",
            steps: [
                "Try to create NFT without connecting wallet",
                "Verify error message"
            ],
            expectedResult: "Error: Please connect your wallet first"
        },
        {
            name: "Empty Form Fields",
            steps: [
                "Connect wallet",
                "Leave form fields empty",
                "Submit form",
                "Verify validation error"
            ],
            expectedResult: "Error: Please fill in all fields"
        },
        {
            name: "NFT Not Found",
            steps: [
                "Enter non-existent account address",
                "Click fetch metadata",
                "Verify not found error"
            ],
            expectedResult: "Error: No NFT metadata found for this account address"
        }
    ],
    
    // Edge case scenarios
    edgeCases: [
        {
            name: "Very Long Strings",
            steps: [
                "Connect wallet",
                "Enter very long NFT name and URI",
                "Submit form",
                "Verify handling"
            ],
            expectedResult: "Long strings handled correctly"
        },
        {
            name: "Special Characters",
            steps: [
                "Connect wallet",
                "Enter NFT name with special characters",
                "Submit form",
                "Verify handling"
            ],
            expectedResult: "Special characters handled correctly"
        },
        {
            name: "Unicode Characters",
            steps: [
                "Connect wallet",
                "Enter NFT name with unicode characters",
                "Submit form",
                "Verify handling"
            ],
            expectedResult: "Unicode characters handled correctly"
        }
    ]
};

// Performance Test Data
const PERFORMANCE_TEST_DATA = {
    // Load testing scenarios
    loadTests: [
        {
            name: "Rapid Connect/Disconnect",
            iterations: 100,
            description: "Test rapid wallet connection and disconnection"
        },
        {
            name: "Multiple NFT Creation",
            iterations: 50,
            description: "Test creating multiple NFTs in sequence"
        },
        {
            name: "Concurrent Metadata Fetching",
            iterations: 25,
            description: "Test fetching metadata from multiple accounts concurrently"
        }
    ],
    
    // Stress testing scenarios
    stressTests: [
        {
            name: "Large Form Data",
            dataSize: "1MB",
            description: "Test with very large form data"
        },
        {
            name: "Many DOM Elements",
            elementCount: 1000,
            description: "Test with many DOM elements"
        },
        {
            name: "Long Running Operations",
            duration: "30 seconds",
            description: "Test long-running operations"
        }
    ]
};

// Test Utilities
const TEST_UTILITIES = {
    // Generate random test data
    generateRandomNFT: function() {
        const names = ['TestNFT', 'ArtNFT', 'GameNFT', 'MusicNFT', 'CollectibleNFT'];
        const domains = ['example.com', 'test.com', 'nft.com', 'art.com', 'game.com'];
        
        return {
            name: names[Math.floor(Math.random() * names.length)] + '_' + Math.random().toString(16).substr(2, 4),
            uri: `https://${domains[Math.floor(Math.random() * domains.length)]}/metadata.json`
        };
    },
    
    // Generate test account address
    generateTestAddress: function() {
        return '0x' + Math.random().toString(16).substr(2, 40);
    },
    
    // Generate mock transaction hash
    generateMockTxHash: function() {
        return 'mock_tx_' + Math.random().toString(16).substr(2, 8);
    },
    
    // Create test form data
    createTestFormData: function(nftData) {
        return {
            nftName: nftData.name || 'TestNFT',
            nftUri: nftData.uri || 'https://example.com/metadata.json',
            accountAddress: nftData.accountAddress || TEST_CONSTANTS.TEST_ACCOUNTS.owner
        };
    },
    
    // Simulate network delay
    simulateNetworkDelay: function(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Create test error
    createTestError: function(message, code = 500) {
        const error = new Error(message);
        error.code = code;
        error.timestamp = new Date().toISOString();
        return error;
    }
};

// Test Configuration
const TEST_CONFIG = {
    // Test timeouts
    timeouts: {
        short: 1000,    // 1 second
        medium: 5000,   // 5 seconds
        long: 30000     // 30 seconds
    },
    
    // Test retry configuration
    retry: {
        maxAttempts: 3,
        delay: 1000
    },
    
    // Test data cleanup
    cleanup: {
        autoCleanup: true,
        cleanupDelay: 5000
    },
    
    // Test reporting
    reporting: {
        verbose: true,
        saveResults: true,
        outputFormat: 'json'
    }
};

// Export all test data and utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TEST_CONSTANTS,
        NFT_TEST_DATA,
        MOCK_APTOS_SDK,
        TEST_SCENARIOS,
        PERFORMANCE_TEST_DATA,
        TEST_UTILITIES,
        TEST_CONFIG
    };
}

// Make available globally for browser testing
if (typeof window !== 'undefined') {
    window.TestData = {
        TEST_CONSTANTS,
        NFT_TEST_DATA,
        MOCK_APTOS_SDK,
        TEST_SCENARIOS,
        PERFORMANCE_TEST_DATA,
        TEST_UTILITIES,
        TEST_CONFIG
    };
    
    console.log('🧪 Test data and fixtures loaded');
    console.log('💡 Available: TestData.TEST_CONSTANTS, TestData.NFT_TEST_DATA, etc.');
}
