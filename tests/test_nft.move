#[test_only]
module my_module::test_nft {
    use my_module::NFTMetadataViewer;
    use std::string;
    use aptos_framework::account;

    #[test(account = @0x1)]
    public fun test_create_and_get() {
        let owner = account::create_account_for_test(@0x1);
        NFTMetadataViewer::create_nft_metadata(&owner, string::utf8(b"TestNFT"), string::utf8(b"https://test.com"));
        let (name, uri) = NFTMetadataViewer::get_nft_metadata(@0x1);
        assert!(string::utf8(b"TestNFT") == name, 0);
        assert!(string::utf8(b"https://test.com") == uri, 1);
    }
}