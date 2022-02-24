const Management = artifacts.require("Management");

module.exports = function (deployer) {
  deployer.deploy(Management);
};