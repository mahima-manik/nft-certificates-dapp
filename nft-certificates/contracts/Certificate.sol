// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Certificate is ERC721URIStorage {
    using Counters for Counters.Counter;

    struct Attribute {
        string[] names;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only NFT owner is allowed to mint");
        _;
    }

    Counters.Counter private _tokenIds;
    address public contractAddress;
    address public owner;
    Attribute attribute;

    constructor(
        string memory _name,
        string memory _symbol,
        string[] memory _field_names
    ) ERC721(_name, _symbol) {
        create_attributes(_field_names);
        contractAddress = address(this);
    }

    /* 
        Creates attribute list for this NFT 
    */
    function create_attributes(string[] memory _field_names) private {
        attribute.names = _field_names;
    }

    function mint(string memory tokenURI, address recipient)
        external
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    /* 
        Returns the total number of tokens issued for this contract address 
    */
    function getTotalTokens() external view returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        return newItemId;
    }

    /* 
        Returns a list of attributes name for this NFT 
    */
    function getAttributes() external view returns (string[] memory) {
        return (attribute.names);
    }
}
