// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "./Certificate.sol";

contract Management {
    struct NftInfo {
        mapping (address => NftHoldersInfo) nftHolders;
        address[] contractAddresses;
        address owner;
    }

    struct NftHoldersInfo {
        mapping (address => bool) holdersInfo;
        address[] holders;
        address nftAddress;
    }

    struct Holder {
        string name;
    }

    event NftCreated(address tokenAddress);
    event NftIssued(address receiver, address tokenAddress, uint tokenId);

    mapping (address => NftInfo) nftadmins;

    function create_nft (string memory _name, string memory _symbol) external {
        Certificate cert = new Certificate(_name, _symbol); // returns bytecode
        // Not storing bytecode, as it will become expensive
        address certAddress = cert.contractAddress();
        
        NftInfo storage nftInfo = nftadmins[msg.sender];
        NftHoldersInfo storage nftHoldersInfo =  nftInfo.nftHolders[certAddress];
        nftInfo.contractAddresses.push(certAddress);
        nftInfo.owner = msg.sender;
        nftHoldersInfo.nftAddress = certAddress;
        
        emit NftCreated(certAddress);
    }

    function issue_certificate(address _receiver, address certAddress, string memory tokenURI) external {
        NftInfo storage nftInfo = nftadmins[msg.sender];
        require (nftInfo.owner == msg.sender, "Do not have authority to issue this token");
        // TODO: check if certificate Address is present

        Certificate certificate = Certificate(certAddress);
        uint tokenId = certificate.mint(tokenURI, _receiver);
        NftHoldersInfo storage nftHoldersInfo = nftInfo.nftHolders[certAddress];
        nftHoldersInfo.holdersInfo[_receiver] = true;
        nftHoldersInfo.holders.push(_receiver);
        emit NftIssued(_receiver, certAddress, tokenId);
    }

    function get_nfts_created() external view returns (address[] memory)   {
        NftInfo storage nftInfo = nftadmins[msg.sender];
        return nftInfo.contractAddresses;
    }

    function get_nft_holders(address certAddress) external view returns (address[] memory) {
        NftHoldersInfo storage nftHoldersInfo = nftadmins[msg.sender].nftHolders[certAddress];
        return nftHoldersInfo.holders;
    }

}