// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.12;

import "./Certificate.sol";

contract IdentityManagement {

    event certificateAdded(address certificateAddress);
    mapping (address => address) public certsToOwners;
    
    function add_certificate(string memory _name, string memory _symbol) external returns(address) {
        Certificate cert = new Certificate(_name, _symbol); // returns bytecode
        // Not storing bytecode, as it will become expensive
        address certAddress = cert.contractAddress();
        certsToOwners[certAddress] = msg.sender;
        emit certificateAdded(certAddress);
        return address(this);
    }

    function issue_certificate(address _receiver, address certAddress, string memory tokenURI) external returns (uint) {
        address authority = certsToOwners[certAddress];
        require (authority == msg.sender, "Do not have authority to issue this token");
        Certificate certificate = Certificate(certAddress);
        return certificate.mint(tokenURI, _receiver);
    }
}
