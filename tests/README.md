# NFT Metadata Viewer - Test Suite Documentation

This directory contains comprehensive test files for the NFT Metadata Viewer application.

## 📁 Test Files Overview

### 1. **Move Smart Contract Tests** (`nft_metadata_viewer_tests.move`)
- **Purpose**: Tests the Move smart contract functionality
- **Coverage**: 
  - NFT metadata creation and retrieval
  - Error handling (NFT not found)
  - Edge cases (empty strings, long strings, special characters)
  - Resource management and storage
  - Function visibility and accessibility

### 2. **Frontend Tests** (`frontend-tests.js`)
- **Purpose**: Tests the JavaScript frontend application
- **Coverage**:
  - SDK initialization and mock mode
  - Wallet connection/disconnection
  - Form validation and submission
  - UI state management
  - Error handling and user feedback
  - Performance testing

### 3. **Integration Tests** (`integration-tests.js`)
- **Purpose**: End-to-end integration testing
- **Coverage**:
  - Move smart contract tests execution
  - Frontend file validation
  - HTML/CSS/JS syntax validation
  - Project structure validation
  - Build process testing
  - Configuration file validation

### 4. **Test Data and Fixtures** (`test-data.js`)
- **Purpose**: Comprehensive test data and utilities
- **Contents**:
  - Test constants and configuration
  - Mock Aptos SDK objects
  - Test scenarios (happy path, error cases, edge cases)
  - Performance test data
  - Test utilities and helpers

## 🚀 How to Run Tests

### Move Smart Contract Tests
```bash
# Run all Move tests
aptos move test

# Run specific test
aptos move test --filter test_create_nft_metadata_success
```

### Frontend Tests
```bash
# Open index.html in browser and run in console:
runNFTTests()

# Or include test file in HTML:
<script src="tests/frontend-tests.js"></script>
```

### Integration Tests
```bash
# Run integration test suite
node tests/integration-tests.js

# Run with verbose output
node tests/integration-tests.js --verbose
```

## 📊 Test Coverage

### Smart Contract Coverage
- ✅ **Function Testing**: All public functions tested
- ✅ **Error Handling**: All error conditions tested
- ✅ **Edge Cases**: Empty strings, long strings, special characters
- ✅ **Resource Management**: Resource creation, storage, and access
- ✅ **Access Control**: Function visibility and permissions

### Frontend Coverage
- ✅ **SDK Integration**: Aptos SDK initialization and usage
- ✅ **Wallet Management**: Connection, disconnection, state management
- ✅ **Form Handling**: Validation, submission, error handling
- ✅ **UI Updates**: Dynamic content updates, state changes
- ✅ **Error Display**: User-friendly error messages
- ✅ **Mock Mode**: Offline testing capabilities

### Integration Coverage
- ✅ **File Validation**: All required files present and valid
- ✅ **Syntax Validation**: HTML, CSS, JavaScript syntax
- ✅ **Build Process**: Compilation and deployment readiness
- ✅ **Configuration**: Move.toml and project configuration
- ✅ **End-to-End**: Complete user workflow testing

## 🧪 Test Scenarios

### Happy Path Scenarios
1. **Successful NFT Creation**
   - Connect wallet → Fill form → Submit → Verify success

2. **Successful NFT Retrieval**
   - Enter address → Fetch metadata → Verify display

3. **Wallet Management**
   - Connect → Use features → Disconnect

### Error Scenarios
1. **Wallet Not Connected**
   - Try to create NFT without wallet → Verify error

2. **Empty Form Fields**
   - Submit empty form → Verify validation error

3. **NFT Not Found**
   - Fetch from non-existent address → Verify error

### Edge Cases
1. **Very Long Strings**
   - Test with maximum length strings

2. **Special Characters**
   - Test with special characters and symbols

3. **Unicode Characters**
   - Test with emoji and unicode characters

## 🔧 Test Configuration

### Timeouts
- **Short**: 1 second (quick operations)
- **Medium**: 5 seconds (normal operations)
- **Long**: 30 seconds (complex operations)

### Retry Logic
- **Max Attempts**: 3 retries
- **Delay**: 1 second between retries

### Cleanup
- **Auto Cleanup**: Enabled
- **Cleanup Delay**: 5 seconds

## 📈 Performance Testing

### Load Tests
- **Rapid Connect/Disconnect**: 100 iterations
- **Multiple NFT Creation**: 50 iterations
- **Concurrent Metadata Fetching**: 25 concurrent requests

### Stress Tests
- **Large Form Data**: 1MB data handling
- **Many DOM Elements**: 1000+ elements
- **Long Running Operations**: 30-second operations

## 🎯 Test Results

### Expected Results
- **Move Tests**: All tests should pass
- **Frontend Tests**: All functionality should work in mock mode
- **Integration Tests**: All validations should pass
- **Performance Tests**: Operations should complete within timeouts

### Success Criteria
- ✅ 100% test pass rate
- ✅ All error conditions handled gracefully
- ✅ Performance within acceptable limits
- ✅ Mock mode fully functional

## 🐛 Debugging Tests

### Common Issues
1. **SDK Loading Failures**: Check CDN availability
2. **Wallet Connection Issues**: Verify wallet extension
3. **Form Validation Errors**: Check input validation logic
4. **Mock Mode Problems**: Verify mock object implementation

### Debug Commands
```bash
# Check Move compilation
aptos move compile

# Check project structure
ls -la sources/ tests/

# Run specific test with verbose output
aptos move test --filter test_name --verbose
```

## 📝 Adding New Tests

### For Move Smart Contract
1. Add test function in `nft_metadata_viewer_tests.move`
2. Use `#[test]` attribute
3. Follow naming convention: `test_function_name`
4. Include proper assertions

### For Frontend
1. Add test method in `NFTMetadataViewerTests` class
2. Follow naming convention: `testFeatureName`
3. Include proper error handling
4. Add to test runner

### For Integration
1. Add test method in `IntegrationTestSuite` class
2. Follow naming convention: `testFeatureName`
3. Include file validation and error handling
4. Add to main test runner

## 🎉 Test Success Indicators

When all tests pass, you should see:
- ✅ All Move tests passing
- ✅ Frontend tests completing successfully
- ✅ Integration tests validating all components
- ✅ Performance tests within acceptable limits
- ✅ Mock mode working perfectly

This indicates your NFT Metadata Viewer is ready for deployment! 🚀
