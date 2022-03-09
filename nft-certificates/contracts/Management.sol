// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./Certificate.sol";

contract Management {
    /* Contains all the NFT addresses created by a particular address */
    struct NftInfo {
        address[] addresses;
    }

    event NftCreated(address tokenAddress);
    event NftIssued(address receiver, address tokenAddress, uint256 tokenId);

    /* mappings of NFT admin address to contract addresses */
    mapping(address => NftInfo) nftadmins;

    /*
        Creates a new NFT contract
        @param _name
        @param _symbol
    */
    function create_nft(
        string memory _name,
        string memory _symbol,
        string[] memory _field_names
    ) external {
        Certificate cert = new Certificate(_name, _symbol, _field_names); // returns bytecode
        
        // Not storing bytecode, as it will become expensive
        address certAddress = cert.contractAddress();

        NftInfo storage nftInfo = nftadmins[msg.sender];
        nftInfo.addresses.push(certAddress);

        emit NftCreated(certAddress);
    }

    /*
        Issues a new NFT on existing contract
        @param receiver NFT to be minted for this address
        @param nftAddress Address of NFT contract
        @param tokenURI NFT to be minted
    */
    function issue_certificate(
        address receiver,
        address nftAddress,
        string memory tokenURI
    ) external {
        Certificate certificate = Certificate(nftAddress);
        uint256 tokenId = certificate.mint(tokenURI, receiver);
        emit NftIssued(receiver, nftAddress, tokenId);
    }

    /*
        Returns a list of all the NFT contracts created by msg.sender
    */
    function get_nft_addresses()
        external
        view
        returns (
            address[] memory,
            string[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        NftInfo storage nftInfo = nftadmins[msg.sender];
        address[] memory addresses = nftInfo.addresses;
        uint256 len = addresses.length;
        string[] memory tokenNames = new string[](len);
        string[] memory tokenSymbols = new string[](len);
        uint256[] memory totalToken = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            Certificate certificate = Certificate(addresses[i]);
            tokenNames[i] = certificate.name();
            tokenSymbols[i] = certificate.symbol();
            totalToken[i] = certificate.getTotalTokens();
        }
        return (addresses, tokenNames, tokenSymbols, totalToken);
    }

    /* Given NFT address, returns a list of attributes for the same */
    function get_nft_attributes(address nftAddress)
        external
        view
        returns (string[] memory)
    {
        Certificate certificate = Certificate(nftAddress);
        require(
            certificate.owner() == msg.sender,
            "Do not have authority to view attributes of this token"
        );
        return certificate.getAttributes();
    }

    /*
        @param certAddress Address of the NFT  
        @return a list of all the NFT holders of this sender

    */
    function get_nft_holders(address certAddress)
        external
        view
        returns (address[] memory)
    {
        Certificate certificate = Certificate(certAddress);
        uint256 totalTokens = certificate.getTotalTokens();

        address[] memory nftHolders = new address[](totalTokens);
        for (uint256 i = 1; i <= totalTokens; i++) {
            address certOwner = certificate.ownerOf(i);
            nftHolders[i - 1] = certOwner;
        }
        return nftHolders;
    }
}
