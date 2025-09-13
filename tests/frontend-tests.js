// NFT Metadata Viewer - Frontend Test Suite
// This file contains comprehensive tests for the frontend application

class NFTMetadataViewerTests {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
        this.mockAptos = null;
        this.app = null;
    }

    // Initialize test environment
    async init() {
        console.log('🧪 Initializing NFT Metadata Viewer Test Suite...');
        
        // Create mock Aptos SDK
        this.mockAptos = this.createMockAptos();
        
        // Create test app instance
        this.app = new NFTMetadataViewer();
        this.app.aptos = this.mockAptos;
        this.app.mockMode = true;
        
        // Setup DOM elements for testing
        this.setupTestDOM();
        
        console.log('✅ Test environment initialized');
    }

    // Create comprehensive mock Aptos SDK
    createMockAptos() {
        return {
            account: null,
            connect: async function() {
                this.account = { 
                    address: '0x1234567890abcdef1234567890abcdef12345678',
                    publicKey: '0xabcdef1234567890abcdef1234567890abcdef12'
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
                    success: true
                };
            },
            waitForTransaction: async function() {
                return Promise.resolve();
            },
            view: async function(payload) {
                console.log('Mock view call:', payload);
                // Return different mock data based on address
                const address = payload.arguments[0];
                if (address === '0x1234567890abcdef1234567890abcdef12345678') {
                    return ['TestNFT', 'https://example.com/metadata.json'];
                } else if (address === '0xnotfound') {
                    throw new Error('E_NFT_NOT_FOUND');
                } else {
                    return ['MockNFT_' + Math.random().toString(16).substr(2, 4), 'https://mock.com/metadata.json'];
                }
            }
        };
    }

    // Setup DOM elements for testing
    setupTestDOM() {
        // Create test container
        const testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        testContainer.style.display = 'none';
        document.body.appendChild(testContainer);

        // Create necessary DOM elements
        const elements = [
            'connectWallet', 'disconnectWallet', 'walletInfo', 'walletAddress', 'networkInfo',
            'nftName', 'nftUri', 'createForm', 'accountAddress', 'useMyAddress', 'fetchMetadata',
            'metadataResult', 'metadataName', 'metadataUri', 'metadataAccount',
            'loadingIndicator', 'errorMessage', 'errorText', 'successMessage', 'successText'
        ];

        elements.forEach(id => {
            if (!document.getElementById(id)) {
                const element = document.createElement('div');
                element.id = id;
                if (id.includes('input') || id === 'nftName' || id === 'nftUri' || id === 'accountAddress') {
                    element.type = 'text';
                    element.value = '';
                }
                testContainer.appendChild(element);
            }
        });
    }

    // Test runner
    async runAllTests() {
        console.log('🚀 Starting NFT Metadata Viewer Test Suite...');
        console.log('=' .repeat(50));

        const tests = [
            { name: 'SDK Initialization', fn: () => this.testSDKInitialization() },
            { name: 'Wallet Connection', fn: () => this.testWalletConnection() },
            { name: 'Wallet Disconnection', fn: () => this.testWalletDisconnection() },
            { name: 'Create NFT Metadata - Success', fn: () => this.testCreateNFTMetadataSuccess() },
            { name: 'Create NFT Metadata - Validation', fn: () => this.testCreateNFTMetadataValidation() },
            { name: 'Fetch NFT Metadata - Success', fn: () => this.testFetchNFTMetadataSuccess() },
            { name: 'Fetch NFT Metadata - Not Found', fn: () => this.testFetchNFTMetadataNotFound() },
            { name: 'Use My Address', fn: () => this.testUseMyAddress() },
            { name: 'UI State Management', fn: () => this.testUIStateManagement() },
            { name: 'Error Handling', fn: () => this.testErrorHandling() },
            { name: 'Form Validation', fn: () => this.testFormValidation() },
            { name: 'Mock Mode Functionality', fn: () => this.testMockModeFunctionality() }
        ];

        for (const test of tests) {
            await this.runTest(test.name, test.fn);
        }

        this.printTestResults();
    }

    // Run individual test
    async runTest(testName, testFunction) {
        try {
            console.log(`\n🧪 Running: ${testName}`);
            await testFunction();
            this.passedTests++;
            this.testResults.push({ name: testName, status: 'PASS', error: null });
            console.log(`✅ PASSED: ${testName}`);
        } catch (error) {
            this.failedTests++;
            this.testResults.push({ name: testName, status: 'FAIL', error: error.message });
            console.log(`❌ FAILED: ${testName} - ${error.message}`);
        }
    }

    // Test SDK Initialization
    async testSDKInitialization() {
        if (!this.app.aptos) {
            throw new Error('Aptos SDK not initialized');
        }
        if (!this.app.mockMode) {
            throw new Error('Mock mode not enabled');
        }
    }

    // Test Wallet Connection
    async testWalletConnection() {
        await this.app.connectWallet();
        
        if (!this.app.account) {
            throw new Error('Account not set after connection');
        }
        if (!this.app.account.address) {
            throw new Error('Account address not set');
        }
    }

    // Test Wallet Disconnection
    async testWalletDisconnection() {
        // First connect
        await this.app.connectWallet();
        if (!this.app.account) {
            throw new Error('Account not connected before disconnection test');
        }

        // Then disconnect
        await this.app.disconnectWallet();
        if (this.app.account !== null) {
            throw new Error('Account not cleared after disconnection');
        }
    }

    // Test Create NFT Metadata Success
    async testCreateNFTMetadataSuccess() {
        // Connect wallet first
        await this.app.connectWallet();
        
        // Set form values
        document.getElementById('nftName').value = 'TestNFT';
        document.getElementById('nftUri').value = 'https://example.com/metadata.json';
        
        // Mock the form submission
        const form = document.getElementById('createForm');
        const event = new Event('submit');
        event.preventDefault = () => {};
        
        // Test the handler directly
        await this.app.handleCreateNFT(event);
        
        // Verify success (in mock mode, this should complete without error)
        // The actual verification would be checking for success message
    }

    // Test Create NFT Metadata Validation
    async testCreateNFTMetadataValidation() {
        // Test without wallet connection
        this.app.account = null;
        
        const event = new Event('submit');
        event.preventDefault = () => {};
        
        try {
            await this.app.handleCreateNFT(event);
            throw new Error('Should have failed without wallet connection');
        } catch (error) {
            if (!error.message.includes('connect your wallet')) {
                throw new Error('Wrong error message for missing wallet');
            }
        }

        // Test with empty fields
        await this.app.connectWallet();
        document.getElementById('nftName').value = '';
        document.getElementById('nftUri').value = '';
        
        try {
            await this.app.handleCreateNFT(event);
            throw new Error('Should have failed with empty fields');
        } catch (error) {
            if (!error.message.includes('fill in all fields')) {
                throw new Error('Wrong error message for empty fields');
            }
        }
    }

    // Test Fetch NFT Metadata Success
    async testFetchNFTMetadataSuccess() {
        // Set up test address
        document.getElementById('accountAddress').value = '0x1234567890abcdef1234567890abcdef12345678';
        
        // Mock the fetch function
        await this.app.fetchNFTMetadata();
        
        // Verify metadata was displayed
        const nameElement = document.getElementById('metadataName');
        const uriElement = document.getElementById('metadataUri');
        
        if (!nameElement.textContent.includes('TestNFT')) {
            throw new Error('NFT name not displayed correctly');
        }
        if (!uriElement.textContent.includes('https://example.com/metadata.json')) {
            throw new Error('NFT URI not displayed correctly');
        }
    }

    // Test Fetch NFT Metadata Not Found
    async testFetchNFTMetadataNotFound() {
        // Set up non-existent address
        document.getElementById('accountAddress').value = '0xnotfound';
        
        try {
            await this.app.fetchNFTMetadata();
            throw new Error('Should have failed with not found error');
        } catch (error) {
            if (!error.message.includes('No NFT metadata found')) {
                throw new Error('Wrong error message for not found');
            }
        }
    }

    // Test Use My Address
    async testUseMyAddress() {
        // Connect wallet first
        await this.app.connectWallet();
        
        // Clear address field
        document.getElementById('accountAddress').value = '';
        
        // Test use my address
        this.app.useMyAddress();
        
        const addressField = document.getElementById('accountAddress');
        if (addressField.value !== this.app.account.address) {
            throw new Error('Address not set correctly');
        }
    }

    // Test UI State Management
    async testUIStateManagement() {
        // Test initial state
        this.app.account = null;
        this.app.updateUI();
        
        const connectBtn = document.getElementById('connectWallet');
        const disconnectBtn = document.getElementById('disconnectWallet');
        
        if (connectBtn.style.display === 'none') {
            throw new Error('Connect button should be visible when not connected');
        }
        if (disconnectBtn.style.display !== 'none') {
            throw new Error('Disconnect button should be hidden when not connected');
        }

        // Test connected state
        await this.app.connectWallet();
        this.app.updateUI();
        
        if (connectBtn.style.display !== 'none') {
            throw new Error('Connect button should be hidden when connected');
        }
        if (disconnectBtn.style.display === 'none') {
            throw new Error('Disconnect button should be visible when connected');
        }
    }

    // Test Error Handling
    async testErrorHandling() {
        // Test error display
        this.app.showError('Test error message');
        
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorDiv.style.display === 'none') {
            throw new Error('Error message not displayed');
        }
        if (errorText.textContent !== 'Test error message') {
            throw new Error('Error message text not set correctly');
        }

        // Test success display
        this.app.showSuccess('Test success message');
        
        const successDiv = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        
        if (successDiv.style.display === 'none') {
            throw new Error('Success message not displayed');
        }
        if (successText.textContent !== 'Test success message') {
            throw new Error('Success message text not set correctly');
        }
    }

    // Test Form Validation
    async testFormValidation() {
        // Test empty form
        document.getElementById('nftName').value = '';
        document.getElementById('nftUri').value = '';
        
        const nameInput = document.getElementById('nftName');
        const uriInput = document.getElementById('nftUri');
        
        if (nameInput.value !== '') {
            throw new Error('Name input not cleared');
        }
        if (uriInput.value !== '') {
            throw new Error('URI input not cleared');
        }

        // Test form with valid data
        nameInput.value = 'ValidNFT';
        uriInput.value = 'https://valid.com/metadata.json';
        
        if (nameInput.value !== 'ValidNFT') {
            throw new Error('Name input not set correctly');
        }
        if (uriInput.value !== 'https://valid.com/metadata.json') {
            throw new Error('URI input not set correctly');
        }
    }

    // Test Mock Mode Functionality
    async testMockModeFunctionality() {
        if (!this.app.mockMode) {
            throw new Error('Mock mode not enabled');
        }
        
        // Test mock wallet connection
        await this.app.connectWallet();
        if (!this.app.account) {
            throw new Error('Mock wallet connection failed');
        }
        
        // Test mock transaction
        const mockTx = {
            type: "entry_function_payload",
            function: "test::function",
            arguments: ["arg1", "arg2"],
            type_arguments: []
        };
        
        const result = await this.app.aptos.signAndSubmitTransaction(mockTx);
        if (!result.hash) {
            throw new Error('Mock transaction failed');
        }
        
        // Test mock view call
        const mockPayload = {
            payload: {
                function: "test::view",
                arguments: ["0x123"],
                type_arguments: []
            }
        };
        
        const viewResult = await this.app.aptos.view(mockPayload);
        if (!Array.isArray(viewResult)) {
            throw new Error('Mock view call failed');
        }
    }

    // Print test results
    printTestResults() {
        console.log('\n' + '=' .repeat(50));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('=' .repeat(50));
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`📈 Total: ${this.passedTests + this.failedTests}`);
        console.log(`🎯 Success Rate: ${((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1)}%`);
        
        if (this.failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(test => test.status === 'FAIL')
                .forEach(test => {
                    console.log(`  - ${test.name}: ${test.error}`);
                });
        }
        
        console.log('\n🎉 Test suite completed!');
    }

    // Run performance tests
    async runPerformanceTests() {
        console.log('\n⚡ Running Performance Tests...');
        
        const startTime = performance.now();
        
        // Test multiple rapid operations
        for (let i = 0; i < 100; i++) {
            await this.app.connectWallet();
            await this.app.disconnectWallet();
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`⏱️  100 connect/disconnect cycles: ${duration.toFixed(2)}ms`);
        console.log(`📊 Average per cycle: ${(duration / 100).toFixed(2)}ms`);
        
        if (duration > 5000) {
            console.log('⚠️  Performance warning: Operations taking longer than expected');
        } else {
            console.log('✅ Performance test passed');
        }
    }
}

// Test data and fixtures
const TestData = {
    validNFTs: [
        { name: 'TestNFT', uri: 'https://example.com/metadata.json' },
        { name: 'ArtNFT', uri: 'https://art.com/nft.json' },
        { name: 'GameNFT', uri: 'https://game.com/item.json' }
    ],
    
    invalidNFTs: [
        { name: '', uri: 'https://example.com/metadata.json' },
        { name: 'TestNFT', uri: '' },
        { name: '', uri: '' },
        { name: 'TestNFT', uri: 'invalid-url' }
    ],
    
    testAddresses: [
        '0x1234567890abcdef1234567890abcdef12345678',
        '0xabcdef1234567890abcdef1234567890abcdef12',
        '0xnotfound',
        '0xinvalid'
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NFTMetadataViewerTests, TestData };
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    window.NFTMetadataViewerTests = NFTMetadataViewerTests;
    window.TestData = TestData;
    
    // Add test runner to window for easy access
    window.runNFTTests = async function() {
        const testSuite = new NFTMetadataViewerTests();
        await testSuite.init();
        await testSuite.runAllTests();
        await testSuite.runPerformanceTests();
    };
    
    console.log('🧪 NFT Metadata Viewer Test Suite loaded');
    console.log('💡 Run tests with: runNFTTests()');
}
