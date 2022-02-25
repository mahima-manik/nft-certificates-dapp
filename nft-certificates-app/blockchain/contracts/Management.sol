// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./Certificate.sol";

contract Management {
    struct NftInfo {
        mapping (address => uint) count;
        address[] addresses;
        address owner;
    }

    event NftCreated(address tokenAddress);
    event NftIssued(address receiver, address tokenAddress, uint tokenId);
    event ViewCount(uint256 total);
    
    mapping (address => NftInfo) nftadmins;

    /*
        Creates a new NFT contract
        @param _name
        @param _symbol
    */
    function create_nft (string memory _name, string memory _symbol) external {
        Certificate cert = new Certificate(_name, _symbol); // returns bytecode
        // Not storing bytecode, as it will become expensive
        address certAddress = cert.contractAddress();

        NftInfo storage nftInfo = nftadmins[msg.sender];
        nftInfo.count[certAddress] = 0;
        nftInfo.addresses.push(certAddress);
        nftInfo.owner = msg.sender;

        emit NftCreated(certAddress);
    }

    /*
        Issues a new NFT on existing contract
        @param receiver NFT to be minted for this address
        @param nftAddress Address of NFT contract
        @param tokenURI NFT to be minted
    */
    function issue_certificate (address receiver, address nftAddress, string memory tokenURI) external {
        NftInfo storage nftInfo = nftadmins[msg.sender];
        require (nftInfo.owner == msg.sender, "Do not have authority to issue this token");
        Certificate certificate = Certificate(nftAddress);
        uint tokenId = certificate.mint(tokenURI, receiver);
        nftInfo.count[nftAddress] += 1;
        emit NftIssued(receiver, nftAddress, tokenId);
    }

    /*
        Returns a list of all the NFT contracts created by msg.sender
    */
    function get_nft_addresses () external view returns (address[] memory, 
        string[] memory, string[] memory, uint256[] memory)   {
        
        NftInfo storage nftInfo = nftadmins[msg.sender];
        address[] memory addresses = nftInfo.addresses;
        uint len = addresses.length;
        string[] memory tokenNames = new string[](len);
        string[] memory tokenSymbols = new string[](len);
        uint256[] memory totalToken = new uint256[](len);
        
        for (uint i=0; i<len; i++)  {
            Certificate certificate = Certificate(addresses[i]);
            tokenNames[i] = certificate.name();
            tokenSymbols[i] = certificate.symbol();
            totalToken[i] = certificate.getTotalTokens();
        }
        return (addresses, tokenNames, tokenSymbols, totalToken);
    }

    /*
        @param certAddress Address of the NFT  
        @return a list of all the NFT holders of this sender

    */
    function get_nft_holders(address certAddress) external view returns(address[] memory) {

        NftInfo storage nftInfo = nftadmins[msg.sender];
        uint totalTokens = nftInfo.count[certAddress];

        address[] memory nftHolders = new address[](totalTokens);
        Certificate certificate = Certificate(certAddress);
        for (uint i=1; i <= totalTokens; i++)   {
            address certOwner = certificate.ownerOf(i);
            nftHolders[i-1] = certOwner;
        }
        return nftHolders;
    }

}