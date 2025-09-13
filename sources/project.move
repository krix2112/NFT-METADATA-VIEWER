module my_module::NFTMetadataViewer {
    use aptos_std::string::String;

    struct NFTMetadata has key, store {
        name: String,
        uri: String,
    }

    const E_NFT_NOT_FOUND: u64 = 1;

    public entry fun create_nft_metadata(owner: &signer, name: String, uri: String) {
        let metadata = NFTMetadata { name, uri };
        move_to(owner, metadata);
    }

    public fun get_nft_metadata(account: address): (String, String) acquires NFTMetadata {
        assert!(exists<NFTMetadata>(account), E_NFT_NOT_FOUND);
        let metadata = borrow_global<NFTMetadata>(account);
        (metadata.name, metadata.uri)
    }
}