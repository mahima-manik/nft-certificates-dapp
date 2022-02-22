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

    mapping (address => NftInfo) nftadmins;

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

    function issue_certificate(address _receiver, address certAddress, string memory tokenURI) external returns (uint) {
        NftInfo storage nftInfo = nftadmins[msg.sender];
        require (nftInfo.owner == msg.sender, "Do not have authority to issue this token");
        Certificate certificate = Certificate(certAddress);
        uint tokenId = certificate.mint(tokenURI, _receiver);
        nftInfo.count[certAddress] += 1;
        return tokenId;
    }

    function get_nfts_created() external view returns (address[] memory)   {
        NftInfo storage nftInfo = nftadmins[msg.sender];
        return nftInfo.addresses;
    }
}