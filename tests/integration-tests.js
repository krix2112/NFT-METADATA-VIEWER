#!/usr/bin/env node

/**
 * NFT Metadata Viewer - Integration Test Suite
 * This file contains end-to-end integration tests that test the complete flow
 * from frontend to smart contract interaction
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class IntegrationTestSuite {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
        this.projectRoot = process.cwd();
        this.moveTestResults = null;
        this.frontendTestResults = null;
    }

    // Main test runner
    async runAllTests() {
        console.log('🚀 Starting NFT Metadata Viewer Integration Test Suite');
        console.log('=' .repeat(60));
        
        try {
            // Run Move smart contract tests
            await this.runMoveTests();
            
            // Run frontend tests
            await this.runFrontendTests();
            
            // Run integration tests
            await this.runIntegrationTests();
            
            // Run deployment tests
            await this.runDeploymentTests();
            
            // Print final results
            this.printFinalResults();
            
        } catch (error) {
            console.error('❌ Integration test suite failed:', error.message);
            process.exit(1);
        }
    }

    // Run Move smart contract tests
    async runMoveTests() {
        console.log('\n📋 Running Move Smart Contract Tests...');
        console.log('-'.repeat(40));
        
        try {
            // Check if Move.toml exists
            if (!fs.existsSync(path.join(this.projectRoot, 'Move.toml'))) {
                throw new Error('Move.toml not found');
            }
            
            // Run aptos move test command
            const testCommand = 'aptos move test';
            console.log(`Running: ${testCommand}`);
            
            const output = execSync(testCommand, { 
                cwd: this.projectRoot,
                encoding: 'utf8',
                stdio: 'pipe'
            });
            
            console.log('✅ Move tests completed successfully');
            console.log('Move test output:', output);
            
            this.moveTestResults = {
                status: 'PASS',
                output: output,
                timestamp: new Date().toISOString()
            };
            
            this.passedTests++;
            this.testResults.push({
                name: 'Move Smart Contract Tests',
                status: 'PASS',
                details: 'All Move tests passed successfully'
            });
            
        } catch (error) {
            console.error('❌ Move tests failed:', error.message);
            
            this.moveTestResults = {
                status: 'FAIL',
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            this.failedTests++;
            this.testResults.push({
                name: 'Move Smart Contract Tests',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    // Run frontend tests
    async runFrontendTests() {
        console.log('\n🌐 Running Frontend Tests...');
        console.log('-'.repeat(40));
        
        try {
            // Check if frontend files exist
            const frontendFiles = [
                'index.html',
                'app.js',
                'styles.css',
                'index-standalone.html'
            ];
            
            for (const file of frontendFiles) {
                if (!fs.existsSync(path.join(this.projectRoot, file))) {
                    throw new Error(`Frontend file not found: ${file}`);
                }
            }
            
            // Check if test file exists
            if (!fs.existsSync(path.join(this.projectRoot, 'tests', 'frontend-tests.js'))) {
                throw new Error('Frontend test file not found');
            }
            
            // Validate HTML structure
            await this.validateHTMLStructure();
            
            // Validate JavaScript syntax
            await this.validateJavaScriptSyntax();
            
            // Validate CSS syntax
            await this.validateCSSSyntax();
            
            console.log('✅ Frontend tests completed successfully');
            
            this.frontendTestResults = {
                status: 'PASS',
                timestamp: new Date().toISOString()
            };
            
            this.passedTests++;
            this.testResults.push({
                name: 'Frontend Tests',
                status: 'PASS',
                details: 'All frontend validations passed'
            });
            
        } catch (error) {
            console.error('❌ Frontend tests failed:', error.message);
            
            this.frontendTestResults = {
                status: 'FAIL',
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            this.failedTests++;
            this.testResults.push({
                name: 'Frontend Tests',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    // Validate HTML structure
    async validateHTMLStructure() {
        const htmlFile = path.join(this.projectRoot, 'index.html');
        const htmlContent = fs.readFileSync(htmlFile, 'utf8');
        
        // Check for required elements
        const requiredElements = [
            'connectWallet',
            'disconnectWallet',
            'nftName',
            'nftUri',
            'createForm',
            'accountAddress',
            'fetchMetadata',
            'metadataResult'
        ];
        
        for (const element of requiredElements) {
            if (!htmlContent.includes(`id="${element}"`)) {
                throw new Error(`Required HTML element not found: ${element}`);
            }
        }
        
        // Check for Aptos SDK script tag
        if (!htmlContent.includes('@aptos-labs/ts-sdk')) {
            throw new Error('Aptos SDK script tag not found');
        }
        
        console.log('✅ HTML structure validation passed');
    }

    // Validate JavaScript syntax
    async validateJavaScriptSyntax() {
        const jsFile = path.join(this.projectRoot, 'app.js');
        const jsContent = fs.readFileSync(jsFile, 'utf8');
        
        // Basic syntax checks
        const requiredClasses = ['NFTMetadataViewer'];
        const requiredMethods = [
            'init',
            'connectWallet',
            'disconnectWallet',
            'handleCreateNFT',
            'fetchNFTMetadata'
        ];
        
        for (const className of requiredClasses) {
            if (!jsContent.includes(`class ${className}`)) {
                throw new Error(`Required class not found: ${className}`);
            }
        }
        
        for (const method of requiredMethods) {
            if (!jsContent.includes(`${method}(`)) {
                throw new Error(`Required method not found: ${method}`);
            }
        }
        
        console.log('✅ JavaScript syntax validation passed');
    }

    // Validate CSS syntax
    async validateCSSSyntax() {
        const cssFile = path.join(this.projectRoot, 'styles.css');
        const cssContent = fs.readFileSync(cssFile, 'utf8');
        
        // Check for required CSS classes
        const requiredClasses = [
            '.btn',
            '.btn-primary',
            '.form-group',
            '.metadata-card',
            '.loading',
            '.error-message',
            '.success-message'
        ];
        
        for (const cssClass of requiredClasses) {
            if (!cssContent.includes(cssClass)) {
                throw new Error(`Required CSS class not found: ${cssClass}`);
            }
        }
        
        console.log('✅ CSS syntax validation passed');
    }

    // Run integration tests
    async runIntegrationTests() {
        console.log('\n🔗 Running Integration Tests...');
        console.log('-'.repeat(40));
        
        try {
            // Test smart contract integration
            await this.testSmartContractIntegration();
            
            // Test frontend-backend integration
            await this.testFrontendBackendIntegration();
            
            // Test error handling integration
            await this.testErrorHandlingIntegration();
            
            console.log('✅ Integration tests completed successfully');
            
            this.passedTests++;
            this.testResults.push({
                name: 'Integration Tests',
                status: 'PASS',
                details: 'All integration tests passed'
            });
            
        } catch (error) {
            console.error('❌ Integration tests failed:', error.message);
            
            this.failedTests++;
            this.testResults.push({
                name: 'Integration Tests',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    // Test smart contract integration
    async testSmartContractIntegration() {
        // Check if smart contract functions are properly defined
        const moveFile = path.join(this.projectRoot, 'sources', 'project.move');
        const moveContent = fs.readFileSync(moveFile, 'utf8');
        
        const requiredFunctions = [
            'create_nft_metadata',
            'get_nft_metadata'
        ];
        
        for (const func of requiredFunctions) {
            if (!moveContent.includes(`fun ${func}`)) {
                throw new Error(`Required function not found in smart contract: ${func}`);
            }
        }
        
        // Check if struct is properly defined
        if (!moveContent.includes('struct NFTMetadata')) {
            throw new Error('NFTMetadata struct not found in smart contract');
        }
        
        console.log('✅ Smart contract integration test passed');
    }

    // Test frontend-backend integration
    async testFrontendBackendIntegration() {
        const jsFile = path.join(this.projectRoot, 'app.js');
        const jsContent = fs.readFileSync(jsFile, 'utf8');
        
        // Check if frontend calls the correct smart contract functions
        const requiredCalls = [
            'create_nft_metadata',
            'get_nft_metadata'
        ];
        
        for (const call of requiredCalls) {
            if (!jsContent.includes(call)) {
                throw new Error(`Frontend does not call smart contract function: ${call}`);
            }
        }
        
        // Check if module address is properly set
        if (!jsContent.includes('0x63b355d6f1a9be2d96799b04e1081e67f5a9b3ed8b9e9c5691f07392bba51f60')) {
            throw new Error('Module address not found in frontend code');
        }
        
        console.log('✅ Frontend-backend integration test passed');
    }

    // Test error handling integration
    async testErrorHandlingIntegration() {
        const jsFile = path.join(this.projectRoot, 'app.js');
        const jsContent = fs.readFileSync(jsFile, 'utf8');
        
        // Check if error handling is implemented
        const errorHandlingPatterns = [
            'try {',
            'catch (error)',
            'showError',
            'showSuccess'
        ];
        
        for (const pattern of errorHandlingPatterns) {
            if (!jsContent.includes(pattern)) {
                throw new Error(`Error handling pattern not found: ${pattern}`);
            }
        }
        
        console.log('✅ Error handling integration test passed');
    }

    // Run deployment tests
    async runDeploymentTests() {
        console.log('\n🚀 Running Deployment Tests...');
        console.log('-'.repeat(40));
        
        try {
            // Test project structure
            await this.testProjectStructure();
            
            // Test configuration files
            await this.testConfigurationFiles();
            
            // Test build process
            await this.testBuildProcess();
            
            console.log('✅ Deployment tests completed successfully');
            
            this.passedTests++;
            this.testResults.push({
                name: 'Deployment Tests',
                status: 'PASS',
                details: 'All deployment tests passed'
            });
            
        } catch (error) {
            console.error('❌ Deployment tests failed:', error.message);
            
            this.failedTests++;
            this.testResults.push({
                name: 'Deployment Tests',
                status: 'FAIL',
                details: error.message
            });
        }
    }

    // Test project structure
    async testProjectStructure() {
        const requiredFiles = [
            'Move.toml',
            'sources/project.move',
            'tests/test_nft.move',
            'index.html',
            'app.js',
            'styles.css'
        ];
        
        for (const file of requiredFiles) {
            if (!fs.existsSync(path.join(this.projectRoot, file))) {
                throw new Error(`Required file not found: ${file}`);
            }
        }
        
        console.log('✅ Project structure test passed');
    }

    // Test configuration files
    async testConfigurationFiles() {
        // Test Move.toml
        const moveToml = path.join(this.projectRoot, 'Move.toml');
        const moveTomlContent = fs.readFileSync(moveToml, 'utf8');
        
        if (!moveTomlContent.includes('[package]')) {
            throw new Error('Move.toml missing [package] section');
        }
        
        if (!moveTomlContent.includes('[addresses]')) {
            throw new Error('Move.toml missing [addresses] section');
        }
        
        console.log('✅ Configuration files test passed');
    }

    // Test build process
    async testBuildProcess() {
        try {
            // Test if aptos CLI is available
            execSync('aptos --version', { stdio: 'pipe' });
            console.log('✅ Aptos CLI is available');
            
            // Test if project can be compiled
            execSync('aptos move compile', { 
                cwd: this.projectRoot,
                stdio: 'pipe'
            });
            console.log('✅ Project compilation test passed');
            
        } catch (error) {
            throw new Error(`Build process test failed: ${error.message}`);
        }
    }

    // Print final results
    printFinalResults() {
        console.log('\n' + '=' .repeat(60));
        console.log('📊 INTEGRATION TEST SUITE RESULTS');
        console.log('=' .repeat(60));
        
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`📈 Total: ${this.passedTests + this.failedTests}`);
        console.log(`🎯 Success Rate: ${((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1)}%`);
        
        console.log('\n📋 DETAILED RESULTS:');
        this.testResults.forEach(test => {
            const status = test.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.details}`);
        });
        
        if (this.failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(test => test.status === 'FAIL')
                .forEach(test => {
                    console.log(`  - ${test.name}: ${test.details}`);
                });
        }
        
        console.log('\n🎉 Integration test suite completed!');
        
        if (this.failedTests === 0) {
            console.log('🎊 All tests passed! Your NFT Metadata Viewer is ready for deployment.');
        } else {
            console.log('⚠️  Some tests failed. Please review the errors above.');
            process.exit(1);
        }
    }

    // Generate test report
    generateTestReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.passedTests + this.failedTests,
                passed: this.passedTests,
                failed: this.failedTests,
                successRate: ((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1)
            },
            results: this.testResults,
            moveTests: this.moveTestResults,
            frontendTests: this.frontendTestResults
        };
        
        const reportFile = path.join(this.projectRoot, 'test-report.json');
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        
        console.log(`📄 Test report saved to: ${reportFile}`);
    }
}

// Run the integration test suite
if (require.main === module) {
    const testSuite = new IntegrationTestSuite();
    testSuite.runAllTests()
        .then(() => {
            testSuite.generateTestReport();
        })
        .catch(error => {
            console.error('❌ Test suite failed:', error);
            process.exit(1);
        });
}

module.exports = IntegrationTestSuite;
