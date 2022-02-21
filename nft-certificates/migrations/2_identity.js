const IdentityManagement = artifacts.require("IdentityManagement");

module.exports = function (deployer) {
  deployer.deploy(IdentityManagement);
};