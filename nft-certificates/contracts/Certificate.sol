// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Certificate is ERC721URIStorage {
    using Counters for Counters.Counter;
    
    struct Attribute {
        string[] fields;
        string[] types;
    }

    Counters.Counter private _tokenIds;
    address public contractAddress;
    Attribute attribute;

    constructor(string memory _name, string memory _symbol, 
        string[] memory _field_name, string[] memory _field_type) ERC721(_name, _symbol) {
        create_attributes(_field_name, _field_type);
        contractAddress = address(this);
    }

    function create_attributes(string[] memory _field_name, string[] memory _field_type) private {
        uint len = _field_name.length;
        require (_field_type.length == len, "Attributes not formed correctly");
        attribute.fields = _field_name;
        attribute.types = _field_type;
    }

    function mint(string memory tokenURI, address recipient) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    /* To return the total number of tokens issued for this contract address */
    function getTotalTokens() external view returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        return newItemId;
    }

    function getAttributes() external view returns (string[] memory, string[] memory)   {
        return (attribute.fields, attribute.types);
    }
}
