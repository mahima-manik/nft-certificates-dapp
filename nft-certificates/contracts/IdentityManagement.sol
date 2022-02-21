// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;

//import "./Certificate.sol";
import "./Cert.sol";

contract IdentityManagement {

    event certificateAdded(address certificateAddress);
    mapping (address => address) certsToOwners;


    function add_certificate(string memory _name, string memory _symbol) external returns(address) {
        Cert cert = new Cert(_name, _symbol); // returns bytecode
        // Not storing bytecode, as it will become expensive
        address certAddress = cert.contractAddress();
        certsToOwners[certAddress] = msg.sender;
        emit certificateAdded(certAddress);
        return address(this);
    }

    function issue_certificate(address _receiver, address certAddress, string memory tokenURI) external returns (uint) {
        address authority = certsToOwners[certAddress];
        require (authority == msg.sender, "Do not have authority to issue this token");
        Cert certificate = Cert(certAddress);
        return certificate.mint(tokenURI, _receiver);
    }
}
