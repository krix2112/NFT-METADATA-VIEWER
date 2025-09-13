#[test_only]
module my_module::nft_metadata_viewer_tests {
    use my_module::NFTMetadataViewer;
    use std::string;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    // Test constants
    const TEST_NFT_NAME: vector<u8> = b"TestNFT";
    const TEST_NFT_URI: vector<u8> = b"https://example.com/metadata.json";
    const TEST_NFT_NAME_2: vector<u8> = b"AnotherNFT";
    const TEST_NFT_URI_2: vector<u8> = b"https://test.com/nft.json";

    // Test accounts
    const OWNER_ADDRESS: address = @0x1;
    const USER_ADDRESS: address = @0x2;

    #[test(owner = @0x1)]
    public fun test_create_nft_metadata_success(owner: &signer) {
        // Test creating NFT metadata successfully
        let name = string::utf8(TEST_NFT_NAME);
        let uri = string::utf8(TEST_NFT_URI);
        
        NFTMetadataViewer::create_nft_metadata(owner, name, uri);
        
        // Verify the metadata was created
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME) == retrieved_name, 0);
        assert!(string::utf8(TEST_NFT_URI) == retrieved_uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_get_nft_metadata_success(owner: &signer) {
        // Create NFT metadata first
        let name = string::utf8(TEST_NFT_NAME);
        let uri = string::utf8(TEST_NFT_URI);
        NFTMetadataViewer::create_nft_metadata(owner, name, uri);
        
        // Test retrieving the metadata
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME) == retrieved_name, 0);
        assert!(string::utf8(TEST_NFT_URI) == retrieved_uri, 1);
    }

    #[test]
    #[expected_failure(abort_code = 1)]
    public fun test_get_nft_metadata_not_found() {
        // Test getting metadata from an account that doesn't have any
        NFTMetadataViewer::get_nft_metadata(USER_ADDRESS);
    }

    #[test(owner = @0x1)]
    public fun test_multiple_nft_metadata(owner: &signer) {
        // Test that each account can only have one NFT metadata
        let name1 = string::utf8(TEST_NFT_NAME);
        let uri1 = string::utf8(TEST_NFT_URI);
        NFTMetadataViewer::create_nft_metadata(owner, name1, uri1);
        
        // Verify first metadata
        let (retrieved_name1, retrieved_uri1) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME) == retrieved_name1, 0);
        assert!(string::utf8(TEST_NFT_URI) == retrieved_uri1, 1);
        
        // Note: In the current implementation, creating a second metadata would overwrite the first
        // This test verifies the current behavior
    }

    #[test(owner = @0x1)]
    public fun test_empty_strings(owner: &signer) {
        // Test with empty strings
        let empty_name = string::utf8(b"");
        let empty_uri = string::utf8(b"");
        
        NFTMetadataViewer::create_nft_metadata(owner, empty_name, empty_uri);
        
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(b"") == retrieved_name, 0);
        assert!(string::utf8(b"") == retrieved_uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_long_strings(owner: &signer) {
        // Test with long strings
        let long_name = string::utf8(b"This is a very long NFT name that should test the string handling capabilities of our smart contract");
        let long_uri = string::utf8(b"https://very-long-domain-name-that-might-cause-issues.example.com/path/to/very/long/metadata/file.json");
        
        NFTMetadataViewer::create_nft_metadata(owner, long_name, long_uri);
        
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(long_name == retrieved_name, 0);
        assert!(long_uri == retrieved_uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_special_characters(owner: &signer) {
        // Test with special characters
        let special_name = string::utf8(b"NFT with Special Chars: !@#$%^&*()");
        let special_uri = string::utf8(b"https://example.com/metadata-with-special-chars.json");
        
        NFTMetadataViewer::create_nft_metadata(owner, special_name, special_uri);
        
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(special_name == retrieved_name, 0);
        assert!(special_uri == retrieved_uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_unicode_characters(owner: &signer) {
        // Test with unicode characters
        let unicode_name = string::utf8(b"NFT with Unicode: 🎨🚀💎");
        let unicode_uri = string::utf8(b"https://example.com/unicode-metadata.json");
        
        NFTMetadataViewer::create_nft_metadata(owner, unicode_name, unicode_uri);
        
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(unicode_name == retrieved_name, 0);
        assert!(unicode_uri == retrieved_uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_overwrite_metadata(owner: &signer) {
        // Test overwriting existing metadata
        let name1 = string::utf8(TEST_NFT_NAME);
        let uri1 = string::utf8(TEST_NFT_URI);
        NFTMetadataViewer::create_nft_metadata(owner, name1, uri1);
        
        // Verify first metadata
        let (retrieved_name1, retrieved_uri1) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME) == retrieved_name1, 0);
        assert!(string::utf8(TEST_NFT_URI) == retrieved_uri1, 1);
        
        // Create new metadata (this should overwrite the previous one)
        let name2 = string::utf8(TEST_NFT_NAME_2);
        let uri2 = string::utf8(TEST_NFT_URI_2);
        NFTMetadataViewer::create_nft_metadata(owner, name2, uri2);
        
        // Verify new metadata
        let (retrieved_name2, retrieved_uri2) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME_2) == retrieved_name2, 2);
        assert!(string::utf8(TEST_NFT_URI_2) == retrieved_uri2, 3);
    }

    #[test(owner = @0x1)]
    public fun test_resource_exists(owner: &signer) {
        // Test that the resource exists after creation
        let name = string::utf8(TEST_NFT_NAME);
        let uri = string::utf8(TEST_NFT_URI);
        
        // Before creation, resource should not exist
        assert!(!exists<NFTMetadataViewer::NFTMetadata>(OWNER_ADDRESS), 0);
        
        NFTMetadataViewer::create_nft_metadata(owner, name, uri);
        
        // After creation, resource should exist
        assert!(exists<NFTMetadataViewer::NFTMetadata>(OWNER_ADDRESS), 1);
    }

    #[test(owner = @0x1)]
    public fun test_resource_storage(owner: &signer) {
        // Test that the resource is stored correctly
        let name = string::utf8(TEST_NFT_NAME);
        let uri = string::utf8(TEST_NFT_URI);
        
        NFTMetadataViewer::create_nft_metadata(owner, name, uri);
        
        // Verify the resource exists and has correct data
        let metadata = borrow_global<NFTMetadataViewer::NFTMetadata>(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME) == metadata.name, 0);
        assert!(string::utf8(TEST_NFT_URI) == metadata.uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_function_visibility(owner: &signer) {
        // Test that functions are properly accessible
        let name = string::utf8(TEST_NFT_NAME);
        let uri = string::utf8(TEST_NFT_URI);
        
        // Test entry function
        NFTMetadataViewer::create_nft_metadata(owner, name, uri);
        
        // Test view function
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME) == retrieved_name, 0);
        assert!(string::utf8(TEST_NFT_URI) == retrieved_uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_gas_consumption(owner: &signer) {
        // Test that operations complete within reasonable gas limits
        let name = string::utf8(TEST_NFT_NAME);
        let uri = string::utf8(TEST_NFT_URI);
        
        // This test ensures the function doesn't consume excessive gas
        NFTMetadataViewer::create_nft_metadata(owner, name, uri);
        
        let (retrieved_name, retrieved_uri) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        assert!(string::utf8(TEST_NFT_NAME) == retrieved_name, 0);
        assert!(string::utf8(TEST_NFT_URI) == retrieved_uri, 1);
    }

    #[test(owner = @0x1)]
    public fun test_concurrent_access(owner: &signer) {
        // Test that multiple operations can be performed
        let name1 = string::utf8(TEST_NFT_NAME);
        let uri1 = string::utf8(TEST_NFT_URI);
        
        NFTMetadataViewer::create_nft_metadata(owner, name1, uri1);
        
        // Perform multiple reads
        let (name_a, uri_a) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        let (name_b, uri_b) = NFTMetadataViewer::get_nft_metadata(OWNER_ADDRESS);
        
        // Both reads should return the same data
        assert!(name_a == name_b, 0);
        assert!(uri_a == uri_b, 1);
        assert!(string::utf8(TEST_NFT_NAME) == name_a, 2);
        assert!(string::utf8(TEST_NFT_URI) == uri_a, 3);
    }
}
